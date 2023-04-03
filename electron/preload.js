const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getAllTest: () => ipcRenderer.invoke('get-all-test')
})
