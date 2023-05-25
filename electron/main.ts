import electron, { app, ipcMain, Menu, session } from 'electron'
import process from 'process'
import path from 'path'
import os from 'os'
import fs from 'fs'

import { setupDb } from 'prisma/prisma'
import { createCard, getReviewableCards, searchCards, updateCard, deleteCard } from 'prisma/queries'
import formatRPCResponse from './formatRPCResponse'

// Taken from the docs: https://www.electronforge.io/config/plugins/vite#hot-module-replacement-hmr
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

const { BrowserWindow } = electron

function createWindow() {
  setupDb()

  const mainWindow = new BrowserWindow({
    width: 1641,
    height: 932,
    webPreferences: {
      nodeIntegration: true,
      // enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    // TODO: Set the dev server flag in the electron api
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // mainWindow.on('closed', () => {
  //   mainWindow = null
  // })
  ipcMain.handle('create-card', formatRPCResponse(createCard))
  ipcMain.handle('get-reviewable-cards', formatRPCResponse(getReviewableCards))
  ipcMain.handle('search-cards', formatRPCResponse(searchCards))
  ipcMain.handle('update-card', formatRPCResponse(updateCard))

  ipcMain.on('show-card-context-menu', (event, cardId: string) => {
    const template = [
      {
        label: 'Delete',
        click: async () => {
          const result = await formatRPCResponse(deleteCard)(event, cardId)

          event.sender.send('card-deleted', { cardId, result })
        },
      },
    ]

    const menu = Menu.buildFromTemplate(template)
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) || undefined })
  })
}

app.whenReady().then(async () => {
  createWindow()

  await loadVueDevToolsExtension()

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

const loadVueDevToolsExtension = async () => {
  // TODO: Investigate whether I can download the extension from the store
  // directly, instead of having to have chrome and the particular extension
  // installed.
  const VUE_DEV_TOOLS_VERSION = '6.5.0_0'
  const VUE_DEV_TOOLS_EXTENSION_ID = 'nhdogjmejiglipccpnnnanhbledajbpd'
  const vueDevToolsPath = path.join(
    os.homedir(),
    `Library/Application Support/Google/Chrome/Default/Extensions/${VUE_DEV_TOOLS_EXTENSION_ID}/${VUE_DEV_TOOLS_VERSION}`,
  )

  if (fs.existsSync(vueDevToolsPath)) {
    await session.defaultSession.loadExtension(vueDevToolsPath)
  } else {
    console.log(
      '[WARN] VueDevTools extension not found, check out https://www.electronjs.org/docs/latest/tutorial/devtools-extension for instructions on how to install',
    )
  }
}
