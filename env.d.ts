/// <reference types="vite/client" />

import type { Card } from '@prisma/client'
import type {
  CreateCardRequest,
  RPCResponse,
  SearchCardsRequest,
  UpdateCardRequest,
} from 'electron/types'
import type { CardWithEverything } from 'prisma/types'

export declare global {
  interface Window {
    electronAPI: electronAPI
  }
}

interface electronAPI {
  createCard: (params: CreateCardRequest) => Promise<RPCResponse<Card>>
  getReviewableCards: () => Promise<RPCResponse<Card[]>>
  searchCards: (params?: SearchCardsRequest) => Promise<RPCResponse<CardWithEverything[]>>
  updateCard: (params: UpdateCardRequest) => Promise<RPCResponse<CardWithEverything>>
  showCardContextMenu: (cardId: string) => void
}
