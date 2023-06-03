import { test, expect } from '@playwright/test'
import { _electron as electron } from 'playwright'
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async () => {
  const latestBuild = findLatestBuild()
  const appInfo = parseElectronApp(latestBuild)

  const electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  })

  const window = await electronApp.firstWindow()

  await window.click('text=Home')

  await expect(window.locator('main')).toContainText('Reviewable Cards: 0')

  await window.click('text=Add Card')

  await electronApp.close()
})
