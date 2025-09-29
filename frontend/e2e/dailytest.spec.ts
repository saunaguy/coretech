import { test, expect } from '@playwright/test'

const API = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

async function seedDaily(page, payload: any) {
  const res = await page.request.post(`${API}/api/v1/daily/tests`, {
    data: payload,
  })
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  return json.id?.toString?.() || String(json.id)
}

test.describe('DailyTest E2E (DB-backed)', () => {
  test('lists by category, solve → gray, favorite toggle', async ({ page }) => {
    // Seed one per category
    const linuxId = await seedDaily(page, {
      title: 'E2E Linux sample',
      category: 'linux',
      questions: [
        { id: 'q1', question: 'ls 상세?', options: ['ls -l', 'ls -a', 'ls -la'], answer: 2 },
      ],
    })
    const serverId = await seedDaily(page, {
      title: 'E2E Server sample',
      category: 'server',
      questions: [
        { id: 'q1', question: 'nginx 시작?', options: ['run', 'start', 'reload'], answer: 1 },
      ],
    })

    // Visit dailytest
    await page.goto('/daily/sets')
    await page.waitForLoadState('networkidle')

    // Expect categories visible
    await expect(page.getByRole('heading', { name: /리눅스/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /서버 운영/ })).toBeVisible()

    // Open linux item
    await page.getByRole('link', { name: /E2E Linux sample/ }).first().click()
    await page.waitForLoadState('networkidle')

    // Choose an option and submit
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: '제출' }).click()
    await expect(page.getByText(/점수:/)).toBeVisible()

    // Back to list
    await page.goto('/daily/sets')
    await page.waitForLoadState('networkidle')

    // Mark as favorite
    const star = page.getByRole('button', { name: '즐겨찾기 토글' }).first()
    await star.click()
    // Star should reflect active state (yellow fill class present)
    await expect(star).toHaveClass(/text-yellow-500/)
  })
})

