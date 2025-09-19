import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:3000';

test.describe('Admin User Flow', () => {
  test('should allow admin to approve a pending user', async ({ page }) => {
    // 1. Login as admin
    await page.goto(`${UI_URL}/login`);
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL(UI_URL);

    // 2. Verify Admin link is visible and navigate to admin page
    const adminLink = page.locator('a[href="/admin"]');
    await expect(adminLink).toBeVisible();
    await adminLink.click();
    await page.waitForURL(`${UI_URL}/admin`);

    // 3. Find the pending user and approve them
    const pendingUserRow = page.locator('li', { hasText: 'pendinguser' });
    await expect(pendingUserRow).toBeVisible();
    await expect(pendingUserRow.locator('p', { hasText: 'pending@example.com' })).toBeVisible();
    
    await pendingUserRow.locator('button', { hasText: 'Approve' }).click();

    // 4. Verify the user is removed from the list
    await expect(pendingUserRow).not.toBeVisible();

    // 5. Logout
    await page.locator('button', { hasText: '로그아웃' }).click();
    await page.waitForURL(`${UI_URL}/`);

    // 6. Login as the newly approved user
    await page.goto(`${UI_URL}/login`);
    await page.fill('input[name="email"]', 'pending@example.com');
    await page.fill('input[name="password"]', 'pendingpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL(UI_URL);

    // 7. Verify login was successful and admin link is not there
    await expect(page.locator('a[href="/admin"]')).not.toBeVisible();
    await expect(page.locator('span', { hasText: 'pendinguser' })).toBeVisible();
  });
});
