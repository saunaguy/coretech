import { test, expect } from '@playwright/test'

test.describe('Console errors check', () => {
  test('no Unexpected identifier as error on lessons and linux pages', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
    })
    page.on('pageerror', (err) => {
      errors.push(`[pageerror] ${String(err)}`)
    })

    // Check pages likely to trigger dynamic chunks
    for (const path of ['/lessons', '/linux']) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
    }

    const suspect = errors.find(e => /Unexpected identifier 'as'/.test(e))
    if (suspect) {
      console.log('Captured error:', suspect)
    }
    expect(suspect, 'Should not see Unexpected identifier as').toBeFalsy()
  })
})

