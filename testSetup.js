// create test.db if it doesn't exist
// run prisma migrate reset
const fs = require('fs')
const { exec } = require('child_process')

const dbPath = './test.db'

const dbExists = fs.existsSync(dbPath)

if (!dbExists) {
  fs.closeSync(fs.openSync(dbPath, 'w'))
}

exec('DATABASE_URL=file:../test.db npx prisma migrate reset --force', (stdout, stderr) => {
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
})
