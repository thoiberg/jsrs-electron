import type { Event } from 'electron'
import type { RPCResponse } from './types'

export default function formatRPCResponse<T, U>(query: (arg0: U) => T) {
  return async (event: Event, args: U): Promise<RPCResponse<T>> => {
    try {
      const response = await query(args)

      return { data: response }
    } catch (e) {
      return errorProcessing(e)
    }
  }
}

export function errorProcessing(e: unknown) {
  let error
  if (e instanceof Error) {
    error = e
  } else if (hasMessage(e)) {
    error = Error(e.message)
  } else {
    error = Error('something went wrong')
  }

  return { error }
}

function hasMessage(x: unknown): x is { message: string } {
  if (x && typeof x === 'object' && 'message' in x) {
    return true
  }

  return false
}
