import { expect } from 'chai'
import chunk from '../../src/chunk.js'

const numbers = [1, 2, 4, 8, 10]
const differentDataTypes = [1, "hello", 3.5, true]
const productObjects = [{ 'name': 'Butter', 'inStock': true },{ 'name': 'Milk', 'inStock': false }]

describe('chunk.js - Phase 1 planned tests', () => {
    describe("PositiveTests", () => {
        it("Lista jaetaan samankokoisiin ryhmiin", () => {
            expect(chunk(numbers, 2))
                .to.deep.equal([[1, 2], [4, 8], [10]])
        })

        it("Lista sisältää erityyppisiä alkioita", () => {
            expect(chunk(differentDataTypes, 2))
                .to.deep.equal([[1, "hello"], [3.5, true]])
        })
        it("Listassa on yksi alkio", () => {
            expect(chunk([1], 1))
                .to.deep.equal([[1]])
        })
        it("Ryhmän koko on suurempi kuin listan pituus", () => {
            expect(chunk(numbers, 10))
                .to.deep.equal([[1, 2, 4, 8, 10]])
        })
        it("Ryhmän kokoa ei anneta, jolloin oletusarvo on 1", () => {
            expect(chunk([1, 2, 3]))
                .to.deep.equal([[1], [2], [3]])
        })
        it("Listan alkiot ovat objekteja", () => {
            expect(chunk(productObjects, 1))
                .to.deep.equal([[{ name: 'Butter', inStock: true }], [{ name: 'Milk', inStock: false}]])
        })
    })

    describe("NegativeTests", () => {
        it("Parametrina annettu lista on null", () => {
            expect(chunk(null, 2))
                .to.deep.equal([])
        })

        it("Parametrina annettu lista on undefined", () => {
            expect(chunk(undefined, 2))
                .to.deep.equal([])
        })

        it("Parametrina annettu lista on tyhjä", () => {
            expect(chunk([], 2))
                .to.deep.equal([])
        })

        it("Ryhmän koko on nolla", () => {
            expect(chunk(numbers, 0))
                .to.deep.equal([])
        })

        it("Ryhmän koko ei ole numeerinen", () => {
            expect(chunk(numbers, "abc"))
                .to.deep.equal([])
        })

        it("Ryhmän koko on negatiivinen", () => {
            expect(chunk(numbers, -2))
                .to.deep.equal([])
        })

        it("Parametrina ei annettu listaa", () => {
            expect(chunk(1, 2))
                .to.deep.equal([]) 
        }) 
    })
})