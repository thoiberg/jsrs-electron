/// <reference types="vite/client" />

import type { Card } from '@prisma/client'
import type { CreateCardRequest, RPCResponse, SearchCardsRequest } from 'electron/types'

export declare global {
  interface Window {
    electronAPI: electronAPI
  }
}

interface electronAPI {
  createCard: (params: CreateCardRequest) => RPCResponse<Card>
  getReviewableCards: () => RPCResponse<Card[]>
  searchCards: (params: SearchCardsRequest) => RPCResponse<Card[]>
}
