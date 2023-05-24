import type { Event } from 'electron'
import errorProcessing from '../prisma/queries/utils/errorProcessing'
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
