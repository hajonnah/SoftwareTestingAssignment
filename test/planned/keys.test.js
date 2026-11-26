import { expect } from 'chai'
import keys from '../../src/keys.js'

describe("keys.js - Unit tests", () => {

  describe("Normal cases", () => {
  
    it('returns object property names', () => {
      expect(keys({ a: 1, b: 2 })).to.deep.equal(['a', 'b'])
    })

    it('returns array indexes as strings', () => {
      expect(keys(['a', 'b', 'c'])).to.deep.equal(['0', '1', '2'])
    })

    it('returns string indexes', () => {
      expect(keys('hi')).to.deep.equal(['0', '1'])
    })

    it('returns own properties only', () => {
      function Foo() {
        this.a = 1
        this.b = 2
      }

      Foo.prototype.c = 3

      expect(keys(new Foo())).to.deep.equal(['a', 'b'])
    })

  })

 describe('Equivalence classes', () => {

    it('returns an empty array for an empty object', () => {
      expect(keys({})).to.deep.equal([])
    })

    it('returns an empty array for an empty array', () => {
      expect(keys([])).to.deep.equal([])
    })

    it('returns keys for objects with different value types', () => {
      const object = {
        a: null,
        b: undefined,
        c: false,
        d: 0,
        e: ''
      }

      expect(keys(object)).to.deep.equal(['a', 'b', 'c', 'd', 'e'])
    })

  })

  describe('Boundary values', () => {

    it('returns keys for a single-property object', () => {
      expect(keys({ a: 1 })).to.deep.equal(['a'])
    })

    it('returns indexes for an array with one element', () => {
      expect(keys([10])).to.deep.equal(['0'])
    })

    it('returns indexes for an array with multiple elements', () => {
      expect(keys([10, 20, 30])).to.deep.equal(['0', '1', '2'])
    })

    it('returns keys for an array with empty values', () => {
      const array = []
      array[2] = '3rd'

      expect(keys(array)).to.deep.equal(['0', '1', '2'])
    })

  })

  describe('Invalid and missing inputs', () => {

    it('returns an empty array for null', () => {
      expect(keys(null)).to.deep.equal([])
    })

    it('returns an empty array for undefined', () => {
      expect(keys(undefined)).to.deep.equal([])
    })

    it('returns an empty array for a number', () => {
      expect(keys(123)).to.deep.equal([])
    })

    it('returns an empty array for a boolean', () => {
      expect(keys(true)).to.deep.equal([])
    })

  })

})