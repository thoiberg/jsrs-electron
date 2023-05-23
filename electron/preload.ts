import { contextBridge, ipcRenderer } from 'electron'
import type { CreateCardRequest, SearchCardsRequest, UpdateCardRequest } from './types'

contextBridge.exposeInMainWorld('electronAPI', {
  createCard: (args: CreateCardRequest) => ipcRenderer.invoke('create-card', args),
  getReviewableCards: () => ipcRenderer.invoke('get-reviewable-cards'),
  searchCards: (args: SearchCardsRequest) => ipcRenderer.invoke('search-cards', args),
  updateCard: (args: UpdateCardRequest) => ipcRenderer.invoke('update-card', args),
  showCardContextMenu: (args: any) => ipcRenderer.send('show-card-context-menu', args),
})

ipcRenderer.on('card-deleted', (event, command) => {
  console.log('************** event', event)
  console.log('************** command', command)
})
