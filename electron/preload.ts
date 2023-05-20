import { contextBridge, ipcRenderer } from 'electron'
import type { CreateCardRequest, SearchCardsRequest, UpdateCardRequest } from './types'

contextBridge.exposeInMainWorld('electronAPI', {
  createCard: (args: CreateCardRequest) => ipcRenderer.invoke('create-card', args),
  getReviewableCards: () => ipcRenderer.invoke('get-reviewable-cards'),
  searchCards: (args: SearchCardsRequest) => ipcRenderer.invoke('search-cards', args),
  updateCard: (args: UpdateCardRequest) => ipcRenderer.invoke('update-card', args),
})
