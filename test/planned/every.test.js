
import { expect } from 'chai'
import every from '../../src/every.js'

describe('every.js', () => {

  describe('Normal cases', () => {

    it('returns true when all elements satisfy the predicate', () => {
      expect(every([2, 4, 6], n => n % 2 === 0)).to.equal(true)
    })

    it('returns false when one element fails the predicate', () => {
      expect(every([2, 3, 6], n => n % 2 === 0)).to.equal(false)
    })

    it('returns false when all elements fail the predicate', () => {
      expect(every([1, 3, 5], n => n % 2 === 0)).to.equal(false)
    })
  })

  describe('Equivalence classes', () => {

    it('handles truthy and falsy non-boolean predicate results', () => {
      expect(every([1, 2], () => 'yes')).to.equal(true)
      expect(every([1, 2], () => 0)).to.equal(false)
    })
  })

  describe('Boundary values', () => {

    it('returns true for an empty array without calling predicate', () => {
      let calls = 0

      const result = every([], () => {
        calls++
        return true
      })

      expect(result).to.equal(true)
      expect(calls).to.equal(0)
    })

    it('returns true for a single passing element', () => {
      expect(every([2], n => n > 0)).to.equal(true)
    })

    it('returns false for a single failing element', () => {
      expect(every([-1], n => n > 0)).to.equal(false)
    })

    it('stops iteration when the first element fails', () => {
      const visited = []

      const result = every([0, 1, 2], n => {
        visited.push(n)
        return n > 0
      })

      expect(result).to.equal(false)
      expect(visited).to.deep.equal([0])
    })

    it('returns false when the last element fails', () => {
      expect(every([1, 2, 0], n => n > 0)).to.equal(false)
    })
  })

  describe('Predicate arguments', () => {

    it('passes value, index and original array to predicate', () => {
      const array = ['a', 'b', 'c']
      const calls = []

      const result = every(array, (value, index, original) => {
        calls.push([value, index, original])
        return true
      })

      expect(result).to.equal(true)
      expect(calls).to.deep.equal([
        ['a', 0, array],
        ['b', 1, array],
        ['c', 2, array]
      ])
    })
  })

  describe('Invalid inputs', () => {

    it('returns true for null and undefined arrays', () => {
      expect(every(null, Boolean)).to.equal(true)
      expect(every(undefined, Boolean)).to.equal(true)
    })

    it('throws TypeError when predicate is not a function', () => {
      expect(() => every([1], null)).to.throw(TypeError)
    })
  })
})
