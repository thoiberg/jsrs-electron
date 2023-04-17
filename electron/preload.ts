import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAllTest: () => ipcRenderer.invoke('get-all-test')
})
