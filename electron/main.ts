import electron, { app, ipcMain } from 'electron'
import process from 'process'
import path from 'path'

import { setupDb, prisma } from './prisma'

const { BrowserWindow } = electron

function createWindow() {
  setupDb()

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      // enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // mainWindow.on('closed', () => {
  //   mainWindow = null
  // })

  ipcMain.handle('get-all-test', async () => {
    try {
      const data = await prisma.test.findMany()

      return data
    } catch (e) {
      return e
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.on('ready', createWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
