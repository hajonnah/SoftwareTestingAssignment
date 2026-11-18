
import { expect } from 'chai'
import filter from '../../src/filter.js'

const numbers = [1, 2, 4, 8, 10]
const differentDataTypes = [1, 'hello', 3.5, true]
const oneTrueItem = [true]
const emptyList = []
const usersObjects = [
  { user: 'barney', active: true },
  { user: 'fred', active: false }
]

describe('filter.js - Phase 1 planned tests', () => {
  describe('PositiveTests', () => {
    it('Samantyyppiset alkiot, useampi palautuva alkio', () => {
      expect(filter(numbers, item => item > 4))
        .to.deep.equal([8, 10])
    })

    it('Erityyppiset alkiot, yksi palautuva alkio', () => {
      expect(filter(differentDataTypes, item => typeof item === 'boolean'))
        .to.deep.equal([true])
    })

    it('Yksi alkio, ei palautuvia alkioita', () => {
      expect(filter(oneTrueItem, item => false))
        .to.deep.equal([])
    })

    it('Objektien suodatus', () => {
      expect(filter(usersObjects, ({ active }) => active))
        .to.deep.equal([{ user: 'barney', active: true }])
    })
  })

  describe('NegativeTests', () => {
    it('Ensimmäinen parametri on null', () => {
      expect(filter(null, item => item > 4))
        .to.deep.equal([])
    })

    it('Toinen parametri on null', () => {
      expect(() => filter(differentDataTypes, null))
        .to.throw(TypeError)
    })

    it('Ensimmäinen parametri on boolean', () => {
      expect(filter(true, item => item > 4))
        .to.deep.equal([])
    })

    it('Toinen parametri on string', () => {
      expect(() => filter(oneTrueItem, 'hello'))
        .to.throw(TypeError)
    })

    it('Ensimmäinen parametri on tyhjä lista', () => {
      expect(filter(emptyList, item => typeof item === 'boolean'))
        .to.deep.equal([])
    })
  })
})


// Tästä alkaa tekoälyn toteuttamat yksikkötestit

describe('filter Tekoälyn yksikkötestit', () => {

  describe('AI Normal cases', () => {

    it('returns elements matching the predicate', () => {
      const result = filter([1, 2, 3, 4, 5], n => n > 2)
      expect(result).to.deep.equal([3, 4, 5])
    })

    it('filters objects by property', () => {
      const users = [
        { user: 'barney', active: true },
        { user: 'fred', active: false }
      ]

      const result = filter(users, user => user.active)
      expect(result).to.deep.equal([users[0]])
    })

    it('preserves the original order', () => {
      const result = filter([5, 1, 4, 2, 3], n => n < 4)
      expect(result).to.deep.equal([1, 2, 3])
    })

    it('preserves duplicate matching values', () => {
      const result = filter([2, 2, 3, 2], n => n === 2)
      expect(result).to.deep.equal([2, 2, 2])
    })
  })

  describe('AI Equivalence classes', () => {

    it('returns all elements when all match', () => {
      const result = filter([1, 2, 3], () => true)
      expect(result).to.deep.equal([1, 2, 3])
    })

    it('returns an empty array when none match', () => {
      const result = filter([1, 2, 3], () => false)
      expect(result).to.deep.equal([])
    })

    it('accepts truthy predicate results', () => {
      const result = filter([1, 2, 3], n => n === 2 ? 'yes' : 0)
      expect(result).to.deep.equal([2])
    })

    it('accepts falsy predicate results', () => {
      const result = filter([0, null, false, '', 1], value => value)
      expect(result).to.deep.equal([1])
    })

    it('supports mixed element types', () => {
      const result = filter([1, 'a', null, true], value =>
        typeof value === 'string'
      )
      expect(result).to.deep.equal(['a'])
    })
  })

  describe('AI Boundary values', () => {

    it('returns an empty array for an empty input', () => {
      expect(filter([], () => true)).to.deep.equal([])
    })

    it('returns the element of a single-element array when matched', () => {
      expect(filter([10], n => n === 10)).to.deep.equal([10])
    })

    it('returns an empty array for a single non-matching element', () => {
      expect(filter([10], n => n !== 10)).to.deep.equal([])
    })

    it('returns an empty array for null input', () => {
      expect(filter(null, () => true)).to.deep.equal([])
    })

    it('returns an empty array for undefined input', () => {
      expect(filter(undefined, () => true)).to.deep.equal([])
    })
  })

  describe('AI Predicate arguments and behavior', () => {

    it('passes value, index and original array to predicate', () => {
      const input = [10, 20, 30]
      const calls = []

      filter(input, (value, index, array) => {
        calls.push({ value, index, array })
        return false
      })

      expect(calls).to.deep.equal([
        { value: 10, index: 0, array: input },
        { value: 20, index: 1, array: input },
        { value: 30, index: 2, array: input }
      ])

      calls.forEach(call => {
        expect(call.array).to.equal(input)
      })
    })

    it('invokes predicate once per element', () => {
      let count = 0

      filter([1, 2, 3], () => {
        count++
        return true
      })

      expect(count).to.equal(3)
    })

    it('does not invoke predicate for an empty array', () => {
      let count = 0

      filter([], () => {
        count++
        return true
      })

      expect(count).to.equal(0)
    })

    it('supports filtering based on index', () => {
      const result = filter(['a', 'b', 'c', 'd'],
        (value, index) => index % 2 === 0
      )

      expect(result).to.deep.equal(['a', 'c'])
    })
  })

  describe('AI Immutability and references', () => {

    it('does not modify the original array', () => {
      const input = [1, 2, 3]
      const original = [...input]

      filter(input, n => n > 1)

      expect(input).to.deep.equal(original)
    })

    it('returns a new array instance', () => {
      const input = [1, 2, 3]
      const result = filter(input, () => true)

      expect(result).to.not.equal(input)
    })

    it('preserves object references', () => {
      const object = { id: 1 }
      const result = filter([object], () => true)

      expect(result[0]).to.equal(object)
    })
  })

  describe('AI Invalid inputs and errors', () => {

    it('propagates errors thrown by predicate', () => {
      const error = new Error('Predicate failed')

      expect(() => filter([1], () => {
        throw error
      })).to.throw(error)
    })

    it('throws when predicate is not a function for non-empty input', () => {
      expect(() => filter([1, 2], null)).to.throw(TypeError)
    })
  })
})