import { contextBridge, ipcRenderer } from 'electron'
import type { CreateCardRequest, SearchCardsRequest, UpdateCardRequest } from './types'
import { ElectronApiChannel } from './types'
import type { electronAPI } from 'env'

const electronApi: electronAPI = {
  createCard: (args: CreateCardRequest) => ipcRenderer.invoke(ElectronApiChannel.CreateCard, args),
  getReviewableCards: () => ipcRenderer.invoke(ElectronApiChannel.GetReviewableCards),
  searchCards: (args?: SearchCardsRequest) =>
    ipcRenderer.invoke(ElectronApiChannel.SearchCards, args),
  updateCard: (args: UpdateCardRequest) => ipcRenderer.invoke(ElectronApiChannel.UpdateCard, args),
  showCardContextMenu: (cardId: string) =>
    ipcRenderer.send(ElectronApiChannel.ShowCardContextMenu, cardId),
}

contextBridge.exposeInMainWorld('electronAPI', electronApi)

// TODO connect it to Vue to automatically update the results
ipcRenderer.on('card-deleted', (event, command) => {
  console.log('************** event', event)
  console.log('************** command', command)
})
