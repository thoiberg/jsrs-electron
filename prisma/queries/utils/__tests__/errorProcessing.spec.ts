import { describe, expect, it } from 'vitest'
import errorProcessing from '../errorProcessing'

describe('with an error object', () => {
  it('returns as error', async () => {
    const returnedError = new Error('oh no')

    const error = errorProcessing(returnedError)

    expect(error).toEqual({ error: returnedError })
  })
})

describe('with an object with a message property', () => {
  it('returns an error with the message', () => {
    const returnedError = { message: 'oh no' }

    const error = errorProcessing(returnedError)

    expect(error.error).toBeInstanceOf(Error)
    expect(error.error.message).toEqual('oh no')
  })
})

describe('with an unknown error value', () => {
  it('returns a generic error message', () => {
    const returnedError = { no: 'idea' }

    const error = errorProcessing(returnedError)

    expect(error.error).toBeInstanceOf(Error)
    expect(error.error.message).toEqual('something went wrong')
  })
})
