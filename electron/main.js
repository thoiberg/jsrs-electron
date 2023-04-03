const electron = require('electron')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const { app } = electron
const { BrowserWindow } = electron

const path = require('path')
const isDev = require('electron-is-dev')
const { ipcMain } = require('electron')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadURL(
    // I copy pasta-d this line from a React example, need to make sure the production build file is actually
    // the same with Vue
    isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.handle('get-all-test', async () => {
    try {
      const data = await prisma.test.findMany()

      return data
    } catch (e) {
      return e
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
