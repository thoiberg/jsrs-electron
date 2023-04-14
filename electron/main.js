const electron = require('electron')
const { app } = require('electron')
const { PrismaClient } = require('@prisma/client')
const process = require('process')
const path = require('path')
const { ipcMain } = require('electron')
const fs = require('fs')
const log = require('electron-log')

const fork = require('child_process').fork

const isDev = process.env.NODE_ENV === 'development'
const dbPath = path.join(app.getPath('userData'), 'app.db')
const dbUrl = isDev ? process.env.DATABASE_URL : 'file:' + dbPath

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
})

const { BrowserWindow } = electron

let mainWindow

function createWindow() {
  setupDb()

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
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

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

function setupDb() {
  log.info(`db path: ${dbPath}`)
  const dbExists = fs.existsSync(dbPath)
  log.info(`does the db exist?: ${dbExists}`)

  if (!dbExists) {
    fs.closeSync(fs.openSync(dbPath, 'w'))
  }

  const prismaPath = path.resolve(__dirname, '..', '..', 'node_modules/prisma/build/index.js')
  const schemaPath = path.join(
    app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
    'prisma',
    'schema.prisma'
  )

  // ['migrate', 'deploy', '--schema', schemaPath]
  const child = fork(prismaPath, ['db', 'push', '--schema', schemaPath], {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'pipe'
  })

  child.on('message', (msg) => {
    log.info(msg)
  })

  child.on('error', (err) => {
    log.error('Child process got error:', err)
  })

  child.on('close', (code, signal) => {
    //
  })

  child.stdout?.on('data', function (data) {
    log.info('prisma: ', data.toString())
  })

  child.stderr?.on('data', function (data) {
    log.error('prisma: ', data.toString())
  })
}
