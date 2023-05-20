/// <reference types="vite/client" />

import type { Card } from '@prisma/client'
import type {
  CreateCardRequest,
  RPCResponse,
  SearchCardsRequest,
  UpdateCardRequest,
} from 'electron/types'
import type { CardWithEverything } from 'prisma/queries/searchCards'

export declare global {
  interface Window {
    electronAPI: electronAPI
  }
}

interface electronAPI {
  createCard: (params: CreateCardRequest) => RPCResponse<Card>
  getReviewableCards: () => RPCResponse<Card[]>
  searchCards: (params?: SearchCardsRequest) => RPCResponse<CardWithEverything[]>
  updateCard: (params: UpdateCardRequest) => RPCResponse<CardWithEverything>
}
