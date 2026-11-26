import { expect } from 'chai'
import isTypedArray from '../../src/isTypedArray.js'

describe('isTypedArray', () => {

    it('recognizes BigInt64Array', () => {
      expect(isTypedArray(new BigInt64Array(2))).to.equal(true)
    })

    it('recognizes BigUint64Array', () => {
      expect(isTypedArray(new BigUint64Array(2))).to.equal(true)
    })
  })