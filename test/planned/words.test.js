import { expect } from 'chai'
import words from '../../src/words.js'

describe('words.js - Unit tests', () => {

  describe('Normal cases', () => {

    it('splits a simple sentence into words', () => {
      expect(words('hello world')).to.deep.equal(['hello', 'world'])
    })

    it('splits words separated by commas', () => {
      expect(words('fred, barney, pebbles'))
        .to.deep.equal(['fred', 'barney', 'pebbles'])
    })

    it('ignores punctuation', () => {
      expect(words('hello, world!'))
        .to.deep.equal(['hello', 'world'])
    })

    it('splits camelCase words', () => {
      expect(words('helloWorld'))
        .to.deep.equal(['hello', 'World'])
    })

    it('splits words containing numbers', () => {
      expect(words('abc123def'))
        .to.deep.equal(['abc', '123', 'def'])
    })

    it('splits words containing special characters', () => {
      expect(words('hello-world_test'))
        .to.deep.equal(['hello', 'world', 'test'])
    })

  })

  describe('Equivalence classes', () => {

    it('returns an empty array for an empty string', () => {
      expect(words('')).to.deep.equal([])
    })

    it('returns an empty array for a string containing only spaces', () => {
      expect(words('   ')).to.deep.equal([])
    })

    it('returns an empty array for a string containing only special chars', () => {
      expect(words('!@#$%^&*()')).to.deep.equal([])
    })

    it('handles uppercase words', () => {
      expect(words('HELLO WORLD'))
        .to.deep.equal(['HELLO', 'WORLD'])
    })

    it('handles lowercase words', () => {
      expect(words('hello world'))
        .to.deep.equal(['hello', 'world'])
    })

    it('handles mixed uppercase and lowercase words', () => {
      expect(words('HELLOWorldAGAIN'))
        .to.deep.equal(['HELLO', 'World', 'AGAIN'])
    })

  })

  describe('Boundary values', () => {

    it('handles a single word', () => {
      expect(words('hello')).to.deep.equal(['hello'])
    })

    it('handles a single character', () => {
      expect(words('a')).to.deep.equal(['a'])
    })

    it('handles a single number', () => {
      expect(words('123')).to.deep.equal(['123'])
    })

    it('handles multiple consecutive spaces', () => {
      expect(words('hello     world'))
        .to.deep.equal(['hello', 'world'])
    })

    it('handles spaces in front and back', () => {
      expect(words('  hello world  '))
        .to.deep.equal(['hello', 'world'])
    })
  
  })

  describe('Custom pattern', () => {
  
    // Simplified patterns to just be single words and not RegExp
    it('returns matched words when pattern finds matches', () => {
      expect(words('hello', 'hello'))
        .to.deep.equal(['hello'])
    })

    it('returns an empty array when pattern finds no matches', () => {
      expect(words('hello', 'world'))
        .to.deep.equal([])
    })
  
  })

})
