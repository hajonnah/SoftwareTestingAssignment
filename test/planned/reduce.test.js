import { expect } from 'chai'
import reduce from '../../src/reduce.js'

describe('reduce.js - Unit tests', () => {

  describe('Normal cases', () => {

    it('reduces an array with an accumulator', () => {
      const result = reduce([1, 2], (sum, n) => sum + n, 0)
      expect(result).to.equal(3)
    })

    it('reduces an array without an accumulator', () => {
      const result = reduce([1, 2], (sum, n) => sum + n)
      expect(result).to.equal(3)
    })

    it('reduces an object', () => {
      const result = reduce({ a: 1, b: 2, c: 3 }, (sum, value) => sum + value, 0)
      expect(result).to.equal(6)
    })

    it('groups object keys by their values', () => {
      const result = reduce(
        { a: 1, b: 2, c: 1 },
        (result, value, key) => {
          (result[value] || (result[value] = [])).push(key)
          return result
        },
        {}
      )

      expect(result).to.deep.equal({
        1: ['a', 'c'],
        2: ['b']
      })
    })

    it('supports multiplication', () => {
      const result = reduce([2, 3, 4], (product, n) => product * n, 1)

      expect(result).to.equal(24)
    })

    it('supports strings', () => {
      const result = reduce(['Hello', ' ', 'World'], (result, value) => result + value, '')

      expect(result).to.equal('Hello World')
    })

  })

  describe('Equivalence classes', () => {
    
    it('iterates n times when an initial accumulator is provided', () => {
      let count = 0

      const result = reduce([10, 20, 30], (sum, n) => {
        count++
        return sum + n
      }, 0)

      expect(result).to.equal(60)
      expect(count).to.equal(3)
    })

    it('uses the first element as accumulator when no initial value is provided', () => {
      let count = 0

      const result = reduce([10, 20, 30], (sum, n) => {
        count++
        return sum + n
      })

      expect(result).to.equal(60)
      expect(count).to.equal(2)
    })

    it('uses null as the initial accumulator', () => {

      let count = 0
      const result = reduce([1, 2], (acc, n) => {
        count++
        return (acc || 0) + n
      }, null)

      expect(result).to.equal(3)
      expect(count).to.equal(2)
    })

    it('uses false as the initial accumulator', () => {
      let count = 0

      const result = reduce([1, 2], (acc, n) => {
        count++
        return (acc === false ? 0 : acc) + n
      }, false)

      expect(result).to.equal(3)
      expect(count).to.equal(2)
    })

    it('uses true as the initial accumulator', () => {
      let count = 0
      
      const result = reduce([1, 2], (acc, n) => {
        count++
        return (acc === false ? 0 : acc) + n
      }, true)

      expect(result).to.equal(4)
      expect(count).to.equal(2)
    })

  })

  describe('Boundary values', () => {

    it('returns the initial accumulator for an empty array', () => {
      const result = reduce([], (sum, n) => sum + n, 0)

      expect(result).to.equal(0)
    })

    it('returns undefined for an empty array without an accumulator', () => {
      const result = reduce([], (sum, n) => sum + n)

      expect(result).to.be.undefined
    })

    it('returns the initial accumulator for an empty object', () => {
      const result = reduce({}, (sum, n) => sum + n, 10)

      expect(result).to.equal(10)
    })

    it('handles arrays containing zero values', () => {
      const result = reduce([0, 0, 0], (sum, n) => sum + n, 0)

      expect(result).to.equal(0)
    })

  })

  describe('Invalid and missing inputs', () => {

    it('returns the accumulator when collection is null', () => {
      const result = reduce(null, (sum, n) => sum + n, 10)

      expect(result).to.equal(10)
    })

    it('returns the accumulator when collection is undefined', () => {
      const result = reduce(undefined, (sum, n) => sum + n, 10)

      expect(result).to.equal(10)
    })

  })

})