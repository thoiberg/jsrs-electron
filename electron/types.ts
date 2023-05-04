export interface CreateCardRequest {
  english: String
  kanji: String
  kana: String
}

export interface RPCSuccessResponse {
  data: Object
}

export interface RPCErrorResponse {
  error: Error
}
export type RPCResponse = RPCSuccessResponse | RPCErrorResponse
