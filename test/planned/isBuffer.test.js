import { expect } from 'chai'
import { Buffer } from 'node:buffer'
import isBuffer from '../../src/isBuffer.js'

describe('isBuffer', () => {

    it('recognizes Node.js Buffer objects in ES Modules', () => {
      expect(isBuffer(Buffer.from([1, 2]))).to.equal(true)
    })
  })