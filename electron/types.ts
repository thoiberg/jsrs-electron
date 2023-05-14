export interface CreateCardRequest {
  english: string
  kanji: string
  kana: string
}

export interface SearchCardsRequest {
  query: string
}

export interface RPCSuccessResponse<T> {
  data: T
  error?: undefined
}

export interface RPCErrorResponse {
  error: Error
  data?: undefined
}
export type RPCResponse<T> = RPCSuccessResponse<T> | RPCErrorResponse
