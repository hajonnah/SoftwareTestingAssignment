
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
