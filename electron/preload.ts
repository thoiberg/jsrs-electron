import { contextBridge, ipcRenderer } from 'electron'
import type { CreateCardRequest, SearchCardsRequest, UpdateCardRequest } from './types'

contextBridge.exposeInMainWorld('electronAPI', {
  createCard: (args: CreateCardRequest) => ipcRenderer.invoke('create-card', args),
  getReviewableCards: () => ipcRenderer.invoke('get-reviewable-cards'),
  searchCards: (args: SearchCardsRequest) => ipcRenderer.invoke('search-cards', args),
  updateCard: (args: UpdateCardRequest) => ipcRenderer.invoke('update-card', args),
  showCardContextMenu: (cardId: string) => ipcRenderer.send('show-card-context-menu', cardId),
})

// TODO connect it to Vue to automatically update the results
ipcRenderer.on('card-deleted', (event, command) => {
  console.log('************** event', event)
  console.log('************** command', command)
})
