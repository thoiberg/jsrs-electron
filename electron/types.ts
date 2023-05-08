export interface CreateCardRequest {
  english: string
  kanji: string
  kana: string
}

export interface RPCSuccessResponse {
  data: Object
  error?: undefined
}

export interface RPCErrorResponse {
  error: Error
  data?: undefined
}
export type RPCResponse = RPCSuccessResponse | RPCErrorResponse
