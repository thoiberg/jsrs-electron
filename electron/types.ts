export enum ElectronApiChannel {
  CreateCard = 'create-card',
  GetReviewableCards = 'get-reviewable-cards',
  SearchCards = 'search-cards',
  UpdateCard = 'update-card',
  ShowCardContextMenu = 'show-card-context-menu',
  CardDeleted = 'card-deleted',
}

export interface CreateCardRequest {
  english: string
  kanji: string
  kana: string
}

export interface SearchCardsRequest {
  query: string
}

export type EnglishAnswerUpsertRequest =
  | (Object & { englishAnswerId: string; answer: string })
  | (Object & { englishCardSideId: string; answer: string })

export type JapaneseAnswerUpsertRequest =
  | { japaneseAnswerId: string; kana?: string; kanji?: string }
  | { japaneseCardSideId: string; kana?: string; kanji?: string }

export type UpdateCardRequest = {
  cardId: string
  englishAnswers?: EnglishAnswerUpsertRequest[]
  japaneseAnswers?: JapaneseAnswerUpsertRequest[]
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
