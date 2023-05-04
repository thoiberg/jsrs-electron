// For some reason importing it returns:
// "Error: PrismaClient is unable to be run in the browser."
const { PrismaClient } = require('@prisma/client')
import path from 'path'
import log from 'electron-log'
import fs from 'fs'
import { fork } from 'child_process'
import { app } from 'electron'

const isDev = process.env.NODE_ENV === 'development'
const dbPath = path.join(app.getPath('userData'), 'app.db')
const dbUrl = isDev ? process.env.DATABASE_URL : 'file:' + dbPath

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
})

// TODO: Only run the migrations when there are un-applied migrations waiting
export function setupDb() {
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

  child.stdout?.on('data', function (data) {
    log.info('prisma: ', data.toString())
  })

  child.stderr?.on('data', function (data) {
    log.error('prisma: ', data.toString())
  })
}
