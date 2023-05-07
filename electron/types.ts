export interface CreateCardRequest {
  english: string
  kanji: string
  kana: string
}

export interface RPCSuccessResponse {
  data: Object
}

export interface RPCErrorResponse {
  error: Error
}
export type RPCResponse = RPCSuccessResponse | RPCErrorResponse
