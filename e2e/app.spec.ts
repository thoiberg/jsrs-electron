import { test, expect } from '@playwright/test'
import { _electron as electron, ElectronApplication } from 'playwright'
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers'

let electronApp: ElectronApplication

test.beforeAll(async () => {
  const latestBuild = findLatestBuild()
  const appInfo = parseElectronApp(latestBuild)

  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  })

  electronApp.on('window', async (page) => {
    const filename = page.url()?.split('/').pop()
    console.log(`Window opened: ${filename}`)

    // capture errors
    page.on('pageerror', (error) => {
      console.error(error)
    })

    // capture console messages
    page.on('console', (msg) => {
      console.log(msg.text())
    })
  })
})

test('visits the app root url', async () => {
  const page = await electronApp.firstWindow()

  page.on('domcontentloaded', async () => {
    await page.click('text=Home')

    await expect(page.locator('main')).toContainText('Reviewable Cards: 0')

    await page.click('text=Add Card')

    await electronApp.close()
  })
})
