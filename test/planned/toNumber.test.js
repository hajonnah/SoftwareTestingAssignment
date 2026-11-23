
import { expect } from 'chai'
import toNumber from '../../src/toNumber.js'

describe('toNumber', () => {

  describe('Normal cases', () => {

    it('should preserve numeric values', () => {
      expect(toNumber(3.2)).to.equal(3.2)
      expect(toNumber(-42)).to.equal(-42)
      expect(toNumber(0)).to.equal(0)
    })

    it('should convert numeric strings and trim whitespace', () => {
      expect(toNumber('3.2')).to.equal(3.2)
      expect(toNumber('-42')).to.equal(-42)
      expect(toNumber('1e3')).to.equal(1000)
      expect(toNumber('  3.2  ')).to.equal(3.2)
      expect(toNumber('\t42\n')).to.equal(42)
    })

    it('should convert binary, octal and hexadecimal strings', () => {
      expect(toNumber('0b1010')).to.equal(10)
      expect(toNumber('0B11')).to.equal(3)
      expect(toNumber('0o17')).to.equal(15)
      expect(toNumber('0O10')).to.equal(8)
      expect(toNumber('0xFF')).to.equal(255)
      expect(toNumber('0X10')).to.equal(16)
    })

    it('should convert boolean, null and undefined values', () => {
      expect(toNumber(true)).to.equal(1)
      expect(toNumber(false)).to.equal(0)
      expect(toNumber(null)).to.equal(0)
      expect(toNumber(undefined)).to.be.NaN
    })
  })

  describe('Equivalence classes', () => {

    it('should convert empty strings and arrays', () => {
      expect(toNumber('')).to.equal(0)
      expect(toNumber('   ')).to.equal(0)
      expect(toNumber([])).to.equal(0)
      expect(toNumber([5])).to.equal(5)
      expect(toNumber(['42'])).to.equal(42)
    })

    it('should convert objects using valueOf', () => {
      expect(toNumber({
        valueOf: () => 42
      })).to.equal(42)

      expect(toNumber({
        valueOf: () => '42'
      })).to.equal(42)
    })

    it('should convert objects using toString', () => {
      const value = {
        valueOf() { return this },
        toString: () => '42'
      }

      expect(toNumber(value)).to.equal(42)
      expect(toNumber({
        toString: () => '42'
      })).to.equal(42)
    })

    it('should handle objects without a callable valueOf', () => {
      const value = {
        valueOf: null,
        toString: () => '42'
      }

      expect(toNumber(value)).to.equal(42)
    })

    it('should return NaN for non-numeric objects', () => {
      expect(toNumber({})).to.be.NaN
      expect(toNumber({
        valueOf: () => 'invalid'
      })).to.be.NaN
    })
  })

  describe('Boundary values', () => {

    it('should preserve positive and negative zero', () => {
      expect(Object.is(toNumber(0), 0)).to.equal(true)
      expect(Object.is(toNumber(-0), -0)).to.equal(true)
      expect(Object.is(toNumber('-0'), -0)).to.equal(true)
    })

    it('should preserve special and extreme numeric values', () => {
      expect(toNumber(Infinity)).to.equal(Infinity)
      expect(toNumber(-Infinity)).to.equal(-Infinity)
      expect(toNumber(NaN)).to.be.NaN
      expect(toNumber(Number.MIN_VALUE))
        .to.equal(Number.MIN_VALUE)
      expect(toNumber(Number.MAX_VALUE))
        .to.equal(Number.MAX_VALUE)
    })

    it('should convert binary and octal boundary values', () => {
      expect(toNumber('0b0')).to.equal(0)
      expect(toNumber('0b1')).to.equal(1)
      expect(toNumber('0o0')).to.equal(0)
      expect(toNumber('0o7')).to.equal(7)
    })
  })

  describe('Invalid inputs', () => {

    it('should return NaN for invalid numeric strings', () => {
      expect(toNumber('abc')).to.be.NaN
      expect(toNumber('12abc')).to.be.NaN
      expect(toNumber('-0xFF')).to.be.NaN
      expect(toNumber('+0xFF')).to.be.NaN
      expect(toNumber('0b102')).to.be.NaN
      expect(toNumber('0o89')).to.be.NaN
    })

    it('should return NaN for arrays with multiple elements', () => {
      expect(toNumber([1, 2])).to.be.NaN
    })

    it('should return NaN for symbols', () => {
      expect(toNumber(Symbol('test'))).to.be.NaN
      expect(toNumber(Object(Symbol('test')))).to.be.NaN
    })

    it('should throw TypeError for invalid object and BigInt conversions', () => {
      const invalid = {
        valueOf: () => ({}),
        toString: () => ({})
      }

      const value = {
        valueOf: () => invalid
      }

      expect(() => toNumber(value)).to.throw(TypeError)
      expect(() => toNumber(0n)).to.throw(TypeError)
      expect(() => toNumber(42n)).to.throw(TypeError)
    })
  })
})

