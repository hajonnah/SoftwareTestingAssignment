import { expect } from 'chai'
import toString from '../../src/toString.js'

describe("toString.js - Unit tests", () => {
  
  describe('Normal cases', () => {

    it('should preserve string values', () => {
      expect(toString('hello')).to.equal('hello')
      expect(toString('')).to.equal('')
      expect(toString('123')).to.equal('123')
    })

    it('should convert numeric values to strings', () => {
      expect(toString(123)).to.equal('123')
      expect(toString(-42)).to.equal('-42')
      expect(toString(3.14)).to.equal('3.14')
      expect(toString(0)).to.equal('0')
    })

    it('should convert boolean values to strings', () => {
      expect(toString(true)).to.equal('true')
      expect(toString(false)).to.equal('false')
    })

    it('should convert arrays to strings', () => {
      expect(toString([1, 2, 3])).to.equal('1,2,3')
      expect(toString(['a', 'b', 'c'])).to.equal('a,b,c')
      expect(toString([1, 'hello', true])).to.equal('1,hello,true')
    })

    it('should convert objects to strings', () => {
      expect(toString({})).to.equal('[object Object]')
    })
  
    it('should convert symbols to strings', () => {
      expect(toString(Symbol('test'))).to.equal('Symbol(test)')
      expect(toString(Symbol())).to.equal('Symbol()')
    })

  })

  describe('Equivalence classes', () => {

    it('returns an empty string for null', () => {
      expect(toString(null)).to.equal('')
    })

    it('returns an empty string for undefined', () => {
      expect(toString(undefined)).to.equal('')
    })

    it('converts nested arrays recursively', () => {
      expect(toString([1, [2, 3]])).to.equal('1,2,3')
      expect(toString([[1, 2], [3, 4]])).to.equal('1,2,3,4')
    })

  })

  describe('Boundary values', () => {

    it('converts an empty array', () => {
      expect(toString([])).to.equal('')
    })

    it('converts arrays containing null and undefined', () => {
      expect(toString([null, undefined, 1])).to.equal(',,1')
    })

    it('converts an array containing empty strings', () => {
      expect(toString(['', 'hello', ''])).to.equal(',hello,')
    })

    it('converts arrays containing different data types', () => {
      expect(toString([1, 'hello', true, null, undefined]))
        .to.equal('1,hello,true,,')
    })

    it('converts Infinity', () => {
      expect(toString(Infinity)).to.equal('Infinity')
    })

    it('converts negative Infinity', () => {
      expect(toString(-Infinity)).to.equal('-Infinity')
    })

    it('converts NaN', () => {
      expect(toString(NaN)).to.equal('NaN')
    })

  })

  describe("Error handling", () => {
    //TODO onko oikein
    it("Aiheuttaa virheen itseensä viittaavalla taulukolla", () => {
      const array = []
      array.push(array)

      expect(() => toString(array)).to.throw(RangeError)
    })
  })
})