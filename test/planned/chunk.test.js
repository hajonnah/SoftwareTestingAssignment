import { expect } from 'chai'
import chunk from '../../src/chunk.js'
import { Buffer } from 'node:buffer'
import esmock from 'esmock'

const numbers = [1, 2, 4, 8, 10]
const differentDataTypes = [1, "hello", 3.5, true]
const productObjects = [{ 'name': 'Butter', 'inStock': true },{ 'name': 'Milk', 'inStock': false }]

describe('chunk.js - Phase 1 planned tests updated', () => {
    let isolatedChunk

    before(async function () {
        isolatedChunk = await esmock('../../src/chunk.js', {
            '../../src/slice.js': (array, start, end) => {
                return array.slice(start, end)
            }
        })
    })

    describe("PositiveTests", () => {

        it("Lista jaetaan samankokoisiin ryhmiin", () => {
            expect(isolatedChunk(numbers, 2))
                .to.deep.equal([[1, 2], [4, 8], [10]])
        })

        it("Lista sisältää erityyppisiä alkioita", () => {
            expect(isolatedChunk(differentDataTypes, 2))
                .to.deep.equal([[1, "hello"], [3.5, true]])
        })
        it("Listassa on yksi alkio", () => {
            expect(isolatedChunk([1], 1))
                .to.deep.equal([[1]])
        })
        it("Ryhmän koko on suurempi kuin listan pituus", () => {
            expect(isolatedChunk(numbers, 10))
                .to.deep.equal([[1, 2, 4, 8, 10]])
        })
        it("Ryhmän kokoa ei anneta, jolloin oletusarvo on 1", () => {
            expect(isolatedChunk([1, 2, 3]))
                .to.deep.equal([[1], [2], [3]])
        })
        it("Listan alkiot ovat objekteja", () => {
            expect(isolatedChunk(productObjects, 1))
                .to.deep.equal([[{ name: 'Butter', inStock: true }], [{ name: 'Milk', inStock: false}]])
        })
    })

    describe("NegativeTests", () => {
        it("Parametrina annettu lista on null", () => {
            expect(isolatedChunk(null, 2))
                .to.deep.equal([])
        })

        it("Parametrina annettu lista on undefined", () => {
            expect(isolatedChunk(undefined, 2))
                .to.deep.equal([])
        })

        it("Parametrina annettu lista on tyhjä", () => {
            expect(isolatedChunk([], 2))
                .to.deep.equal([])
        })

        it("Ryhmän koko on nolla", () => {
            expect(isolatedChunk(numbers, 0))
                .to.deep.equal([])
        })

        it("Ryhmän koko ei ole numeerinen", () => {
            expect(isolatedChunk(numbers, "abc"))
                .to.deep.equal([])
        })

        it("Ryhmän koko on negatiivinen", () => {
            expect(isolatedChunk(numbers, -2))
                .to.deep.equal([])
        })

        it("Parametrina ei annettu listaa", () => {
            expect(isolatedChunk(1, 2))
                .to.deep.equal([]) 
        }) 
    })
})


describe('chunk.js - Tekoälyn luomat testit', function () {

  describe('Normaalitilanteet', function () {

    it('jakaa taulukon tasakokoisiin ryhmiin', function () {
      expect(chunk(['a', 'b', 'c', 'd'], 2))
        .to.deep.equal([['a', 'b'], ['c', 'd']])
    })

    it('palauttaa viimeiseen ryhmään jäljelle jäävät alkiot', function () {
      expect(chunk(['a', 'b', 'c', 'd'], 3))
        .to.deep.equal([['a', 'b', 'c'], ['d']])
    })

    it('jakaa taulukon yhden alkion ryhmiin', function () {
      expect(chunk([1, 2, 3]))
        .to.deep.equal([[1], [2], [3]])
    })

    it('palauttaa yhden ryhmän, kun koko taulukko mahtuu yhteen ryhmään', function () {
      expect(chunk([1, 2, 3], 5))
        .to.deep.equal([[1, 2, 3]])
    })

    it('käsittelee yhden alkion taulukon', function () {
      expect(chunk([42], 1))
        .to.deep.equal([[42]])
    })

    it('säilyttää alkioiden järjestyksen', function () {
      expect(chunk([5, 2, 9, 1, 7], 2))
        .to.deep.equal([[5, 2], [9, 1], [7]])
    })

    it('säilyttää alkuperäisten alkioiden arvot', function () {
      const input = [null, undefined, false, 0, '']

      expect(chunk(input, 2)).to.deep.equal([
        [null, undefined],
        [false, 0],
        ['']
      ])
    })

    it('palauttaa uuden taulukon eikä muuta alkuperäistä', function () {
      const input = [1, 2, 3, 4]
      const original = [...input]

      const result = chunk(input, 2)

      expect(result).to.not.equal(input)
      expect(input).to.deep.equal(original)
    })

  })

  describe('Tyhjät ja puuttuvat syötteet', function () {

    it('palauttaa tyhjän taulukon tyhjällä syötetaulukolla', function () {
      expect(chunk([])).to.deep.equal([])
    })

    it('palauttaa tyhjän taulukon, kun syöte on null', function () {
      expect(chunk(null)).to.deep.equal([])
    })

    it('palauttaa tyhjän taulukon, kun syöte on undefined', function () {
      expect(chunk(undefined)).to.deep.equal([])
    })

    it('palauttaa tyhjän taulukon tyhjällä syötteellä ja positiivisella koolla', function () {
      expect(chunk([], 3)).to.deep.equal([])
    })

  })

  describe('Ryhmän koon raja-arvot', function () {

    it('käsittelee koon nolla palauttamalla tyhjän taulukon', function () {
      expect(chunk([1, 2, 3], 0)).to.deep.equal([])
    })

    it('käsittelee negatiivisen koon palauttamalla tyhjän taulukon', function () {
      expect(chunk([1, 2, 3], -2)).to.deep.equal([])
    })

    it('käsittelee koon yksi', function () {
      expect(chunk([1, 2, 3], 1))
        .to.deep.equal([[1], [2], [3]])
    })

    it('käsittelee koon, joka vastaa taulukon pituutta', function () {
      expect(chunk([1, 2, 3], 3))
        .to.deep.equal([[1, 2, 3]])
    })

    it('käsittelee koon, joka on suurempi kuin taulukon pituus', function () {
      expect(chunk([1, 2, 3], 10))
        .to.deep.equal([[1, 2, 3]])
    })

    it('käsittelee desimaalisen koon katkaisemalla sen kokonaisluvuksi', function () {
      expect(chunk([1, 2, 3, 4, 5], 2.9))
        .to.deep.equal([[1, 2], [3, 4], [5]])
    })

    it('käsittelee negatiivisen desimaalisen koon', function () {
      expect(chunk([1, 2, 3], -1.5))
        .to.deep.equal([])
    })

    it('käsittelee positiivisen desimaalisen koon alle yhden', function () {
      expect(chunk([1, 2, 3], 0.9))
        .to.deep.equal([])
    })

  })

  describe('Koon muuntaminen kokonaisluvuksi', function () {

    it('käsittelee numeerisen merkkijonon', function () {
      expect(chunk([1, 2, 3, 4], '2'))
        .to.deep.equal([[1, 2], [3, 4]])
    })

    it('käsittelee merkkijonon, joka sisältää desimaaliluvun', function () {
      expect(chunk([1, 2, 3, 4, 5], '2.8'))
        .to.deep.equal([[1, 2], [3, 4], [5]])
    })

    it('käsittelee tyhjän merkkijonon', function () {
      expect(chunk([1, 2, 3], ''))
        .to.deep.equal([])
    })

    it('käsittelee virheellisen numeerisen merkkijonon', function () {
      expect(chunk([1, 2, 3], 'abc'))
        .to.deep.equal([])
    })

    it('käsittelee NaN-arvon', function () {
      expect(chunk([1, 2, 3], NaN))
        .to.deep.equal([])
    })

    it('käsittelee Infinity-arvon', function () {
      expect(chunk([1, 2, 3], Infinity))
        .to.deep.equal([[1, 2, 3]])
    })

    it('käsittelee negatiivisen äärettömyyden', function () {
      expect(chunk([1, 2, 3], -Infinity))
        .to.deep.equal([])
    })

    it('käsittelee boolean-arvon true', function () {
      expect(chunk([1, 2, 3], true))
        .to.deep.equal([[1], [2], [3]])
    })

    it('käsittelee boolean-arvon false', function () {
      expect(chunk([1, 2, 3], false))
        .to.deep.equal([])
    })

  })

  describe('Taulukon erityistapaukset', function () {

    it('käsittelee sisäkkäisiä taulukoita', function () {
      const input = [[1, 2], [3, 4], [5, 6]]

      expect(chunk(input, 2)).to.deep.equal([
        [[1, 2], [3, 4]],
        [[5, 6]]
      ])
    })

    it('käsittelee taulukon, jossa on toistuvia alkioita', function () {
      expect(chunk([1, 1, 1, 1], 2))
        .to.deep.equal([[1, 1], [1, 1]])
    })

    it('käsittelee taulukon, jossa on tyhjiä kohtia', function () {
      const input = [1, , 3]

      const result = chunk(input, 2)

      expect(result.length).to.equal(2)
      expect(result[0][0]).to.equal(1)
      expect(1 in result[0]).to.equal(false)
      expect(result[1]).to.deep.equal([3])
    })

    it('säilyttää olioiden viittaukset', function () {
      const first = { id: 1 }
      const second = { id: 2 }

      const result = chunk([first, second], 1)

      expect(result[0][0]).to.equal(first)
      expect(result[1][0]).to.equal(second)
    })

  })

  describe('Virheelliset syötteet', function () {

    it('käsittelee merkkijonon array-argumenttina', function () {
      expect(chunk('abcd', 2))
        .to.deep.equal(['ab', 'cd'])
    })

    it('käsittelee array-argumenttina olion, jolla on length-ominaisuus', function () {
      const input = {
        0: 'a',
        1: 'b',
        2: 'c',
        length: 3
      }

      expect(chunk(input, 2))
        .to.deep.equal([['a', 'b'], ['c']])
    })

    it('käsittelee objektin, jonka length on nolla', function () {
      expect(chunk({ length: 0 }, 2)).to.deep.equal([])
    })

    it('käsittelee negatiivisen length-arvon', function () {
      expect(chunk({ length: -1 }, 2)).to.deep.equal([])
    })

    it('heittää virheen, jos syötteellä ei ole length-ominaisuutta', function () {
      expect(() => chunk({}, 2)).to.throw()
    })

    it('heittää virheen, jos syöte on numero', function () {
      expect(() => chunk(123, 2)).to.throw()
    })

    it('heittää virheen, jos syöte on boolean', function () {
      expect(() => chunk(true, 2)).to.throw()
    })

    it('käsittelee puuttuvan koon oletusarvon mukaisesti', function () {
      expect(chunk([1, 2, 3]))
        .to.deep.equal([[1], [2], [3]])
    })

  })

})