import { expect } from 'chai'
import isEmpty from '../../src/isEmpty.js'
import { Buffer } from 'node:buffer'
import esmock from 'esmock'


describe('isEmpty', () => {

  // ============================================================
  // INTEGRATED TESTS - REAL DEPENDENCIES
  // ============================================================

  describe('Integrated tests - real dependencies', () => {

    describe('Primitive values and nullish values', () => {

      it('returns true for null and undefined', () => {
        expect(isEmpty(null)).to.equal(true)
        expect(isEmpty(undefined)).to.equal(true)
      })

      it('returns true for numbers, booleans and symbols', () => {
        expect(isEmpty(0)).to.equal(true)
        expect(isEmpty(42)).to.equal(true)
        expect(isEmpty(NaN)).to.equal(true)
        expect(isEmpty(true)).to.equal(true)
        expect(isEmpty(false)).to.equal(true)
        expect(isEmpty(Symbol('test'))).to.equal(true)
      })

      it('returns true for an empty string and false for non-empty strings', () => {
        expect(isEmpty('')).to.equal(true)
        expect(isEmpty('a')).to.equal(false)
        expect(isEmpty('abc')).to.equal(false)
        expect(isEmpty(' ')).to.equal(false)
      })
    })

    describe('Arrays and array-like values', () => {

      it('returns true for an empty array and false for non-empty arrays', () => {
        expect(isEmpty([])).to.equal(true)
        expect(isEmpty([1])).to.equal(false)
        expect(isEmpty([1, 2, 3])).to.equal(false)
      })

      it('considers sparse arrays non-empty when length is greater than zero', () => {
        expect(isEmpty(new Array(3))).to.equal(false)
      })

      it('considers arrays containing falsy values non-empty', () => {
        expect(isEmpty([undefined])).to.equal(false)
        expect(isEmpty([null])).to.equal(false)
        expect(isEmpty([0])).to.equal(false)
        expect(isEmpty([false])).to.equal(false)
      })

      it('checks arguments objects using their length', () => {
        function getArguments() {
          return arguments
        }

        expect(isEmpty(getArguments())).to.equal(true)
        expect(isEmpty(getArguments(1))).to.equal(false)
      })

      it('checks typed arrays using their length', () => {
        expect(isEmpty(new Uint8Array(0))).to.equal(true)
        expect(isEmpty(new Uint8Array([1, 2]))).to.equal(false)
      })

      it('checks BigInt typed arrays', () => {
        expect(isEmpty(new BigInt64Array(0))).to.equal(true)
        expect(isEmpty(new BigInt64Array([1n, 2n]))).to.equal(false)
        expect(isEmpty(new BigUint64Array(0))).to.equal(true)
        expect(isEmpty(new BigUint64Array([1n]))).to.equal(false)
      })

      it('checks Node.js buffers using their length', () => {
        expect(isEmpty(Buffer.alloc(0))).to.equal(true)
        expect(isEmpty(Buffer.from([1, 2]))).to.equal(false)
      })

      it('checks jQuery-like collections using their length', () => {
        const emptyCollection = { length: 0, splice() {} }
        const nonEmptyCollection = { length: 2, splice() {} }

        expect(isEmpty(emptyCollection)).to.equal(true)
        expect(isEmpty(nonEmptyCollection)).to.equal(false)
      })
    })

    describe('Maps and Sets', () => {

      it('returns true for empty Maps and false for non-empty Maps', () => {
        expect(isEmpty(new Map())).to.equal(true)
        expect(isEmpty(new Map([['a', 1]]))).to.equal(false)
      })

      it('returns true for empty Sets and false for non-empty Sets', () => {
        expect(isEmpty(new Set())).to.equal(true)
        expect(isEmpty(new Set([1]))).to.equal(false)
      })

      it('considers Maps and Sets containing undefined non-empty', () => {
        expect(isEmpty(new Map([['a', undefined]]))).to.equal(false)
        expect(isEmpty(new Set([undefined]))).to.equal(false)
      })
    })

    describe('Objects and enumerable properties', () => {

      it('returns true for empty objects and false for objects with own enumerable properties', () => {
        expect(isEmpty({})).to.equal(true)
        expect(isEmpty({ a: 1 })).to.equal(false)
        expect(isEmpty({ a: undefined })).to.equal(false)
      })

      it('ignores inherited enumerable properties', () => {
        const prototype = { inherited: 1 }
        const object = Object.create(prototype)

        expect(isEmpty(object)).to.equal(true)

        object.own = 2
        expect(isEmpty(object)).to.equal(false)
      })

      it('ignores non-enumerable own properties', () => {
        const object = {}

        Object.defineProperty(object, 'hidden', {
          value: 1,
          enumerable: false
        })

        expect(isEmpty(object)).to.equal(true)
      })

      it('ignores symbol-keyed properties', () => {
        const object = { [Symbol('key')]: 1 }

        expect(isEmpty(object)).to.equal(true)
      })

      it('checks prototype objects for own enumerable properties', () => {
        function Example() {}

        expect(isEmpty(Example.prototype)).to.equal(true)

        Example.prototype.value = 1
        expect(isEmpty(Example.prototype)).to.equal(false)
      })
    })

    describe('Special and unusual values', () => {

      it('returns true for functions without own enumerable properties', () => {
        function example() {}

        expect(isEmpty(example)).to.equal(true)

        example.value = 1
        expect(isEmpty(example)).to.equal(false)
      })

      it('does not treat an ordinary object with a length property as a collection', () => {
        expect(isEmpty({ length: 0 })).to.equal(false)
        expect(isEmpty({ length: 2 })).to.equal(false)
      })

      it('propagates errors thrown by property getters', () => {
        const object = {
          get length() {
            throw new Error('Invalid length')
          }
        }

        expect(() => isEmpty(object)).to.throw('Invalid length')
      })
    })
  })

  // ============================================================
  // ISOLATED TESTS - MOCKED DEPENDENCIES
  // ============================================================

  describe('Isolated tests - mocked dependencies', () => {

    it('returns true for null without calling dependencies', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => {
          throw new Error('Dependency should not be called')
        }
      })

      expect(isolatedIsEmpty(null)).to.equal(true)
      expect(isolatedIsEmpty(undefined)).to.equal(true)
    })

    it('uses length when an array-like value is recognized', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => true
      })

      expect(isolatedIsEmpty([])).to.equal(true)
      expect(isolatedIsEmpty([1, 2])).to.equal(false)
    })

    it('uses isTypedArray to recognize typed arrays', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => true,
        '../../src/isTypedArray.js': () => true
      })

      expect(isolatedIsEmpty({ length: 0 })).to.equal(true)
      expect(isolatedIsEmpty({ length: 2 })).to.equal(false)
    })

    it('uses isBuffer to recognize buffer-like values', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => true,
        '../../src/isBuffer.js': () => true
      })

      expect(isolatedIsEmpty({ length: 0 })).to.equal(true)
      expect(isolatedIsEmpty({ length: 3 })).to.equal(false)
    })

    it('uses isArguments to recognize arguments-like values', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => true,
        '../../src/isArguments.js': () => true
      })

      expect(isolatedIsEmpty({ length: 0 })).to.equal(true)
      expect(isolatedIsEmpty({ length: 1 })).to.equal(false)
    })

    it('falls back to own enumerable properties when not array-like', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => false
      })

      expect(isolatedIsEmpty({})).to.equal(true)
      expect(isolatedIsEmpty({ name: 'test' })).to.equal(false)
    })

    it('does not use length when isArrayLike returns false', async () => {
      const isolatedIsEmpty = await esmock('../../src/isEmpty.js', {
        '../../src/isArrayLike.js': () => false,
        '../../src/isTypedArray.js': () => {
          throw new Error('Should not be called')
        }
      })

      expect(isolatedIsEmpty({ length: 0 })).to.equal(false)
    })
  })

})
