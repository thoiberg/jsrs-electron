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
    // TODO: get working. Currently it causes timeouts when running
    // recordVideo: {
    //   dir: '/test-results',
    //   size: {
    //     width: 1641,
    //     height: 932,
    //   },
    // },
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

    await page.screenshot({ path: 'test-results/add_card.png' })

    // add card
    // go home and confirm the count is 1
    // go to search and confirm it can be found in search
    // confirm it can be edited
    // right click and delete
    // confirm it's no longer in the search results
    // confirm that the count is now 0 (this is actually a known bug)

    await electronApp.close()
  })
})
