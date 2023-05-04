/// <reference types="vite/client" />

import type { CreateCardRequest, RPCResponse } from 'electron/types'

export declare global {
  interface Window {
    electronAPI: electronAPI
  }
}

interface electronAPI {
  createCard: (params: CreateCardRequest) => RPCResponse
}
