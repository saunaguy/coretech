import { test, expect } from '@playwright/test'

test.describe('LinuxTest2 reader scroll behavior', () => {
  test('scroll resets to top when opening another lesson', async ({ page }) => {
    await page.goto('/linuxtest2')

    // Ensure sidebar rendered
    await expect(page.getByText('명령어 목록')).toBeVisible()

    // Optionally mock backend when E2E_MOCK_BACKEND=1 (for CI or local without backend)
    if (process.env.E2E_MOCK_BACKEND === '1') {
      await page.route('**/api/v1/lesson-search**', (route) => {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      })
      await page.route('**/content/lesson/**', (route) => {
        route.fulfill({ status: 200, contentType: 'text/markdown', body: '# 제목\n\n본문 단락\n\n- 항목 1\n- 항목 2' })
      })
    }

    // Click first visible item in sidebar list
    // The LinuxSidebar renders items under a list; pick a button or clickable element
    const first = page.locator('aside >> text=/./').first()
    await first.click({ trial: false }).catch(() => {})

    // Wait until markdown content shows up
    await expect(page.locator('.md-prose')).toBeVisible({ timeout: 10000 })

    // Scroll near bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
      return 0
    })

    // Click another item in sidebar (second element)
    const second = page.locator('aside >> text=/./').nth(1)
    await second.click({ trial: false }).catch(() => {})

    // Wait for content to update (the header title changes or content rerenders)
    await page.waitForTimeout(400)

    // Expect window to be at top (allow small tolerance)
    const y = await page.evaluate(() => window.scrollY)
    expect(y).toBeLessThan(5)
  })
})

test.describe('Lesson search API smoke', () => {
  test('GET /api/v1/lesson-search responds with JSON array', async ({ request, baseURL }) => {
    const url = new URL('/api/v1/lesson-search?q=test&limit=3', baseURL!)
    const res = await request.get(url.toString())
    expect(res.status()).toBeLessThan(500)
    const ct = res.headers()['content-type'] || ''
    expect(ct.includes('application/json')).toBeTruthy()
    const body = await res.json().catch(() => null)
    expect(Array.isArray(body)).toBeTruthy()
  })
})
