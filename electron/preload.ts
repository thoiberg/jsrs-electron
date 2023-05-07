import { contextBridge, ipcRenderer } from 'electron'
import type { CreateCardRequest } from './types'

contextBridge.exposeInMainWorld('electronAPI', {
  createCard: (args: CreateCardRequest) => ipcRenderer.invoke('create-card', args)
})
