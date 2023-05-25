const fs = require('fs')
const { exec } = require('child_process')

const dbPath = `./${process.env.DATABASE_FILENAME}`

const dbExists = fs.existsSync(dbPath)

if (!dbExists) {
  fs.closeSync(fs.openSync(dbPath, 'w'))
}

exec('npx prisma migrate reset --force --skip-seed', (_error, stdout, stderr) => {
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
})
