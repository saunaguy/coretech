import { test, expect } from '@playwright/test'

const API = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

test.describe('DailyTest Linux count (from seeded 2-question parts)', () => {
  test('API returns ~50 linux parts and UI lists many', async ({ page }) => {
    const res = await page.request.get(`${API}/api/v1/daily/tests?category=linux`)
    expect(res.ok()).toBeTruthy()
    const arr = await res.json()
    expect(Array.isArray(arr)).toBeTruthy()
    // Expect at least 45 items (49~50 typical when chunk-size=2)
    expect(arr.length).toBeGreaterThanOrEqual(45)

    // Visit UI and ensure many items render
    await page.goto('/daily/sets?category=linux')
    await page.waitForLoadState('networkidle')
    const links = page.locator('a[href^="/daily/"')
    await expect(links.first()).toBeVisible()
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(30)
  })
})

