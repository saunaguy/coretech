import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to register and then login', async ({ page }) => {
    // Generate unique credentials for each test run
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const username = `testuser${timestamp}`;
    const password = 'password123';

    // 1. Register
    await page.goto('http://localhost:3000/register');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2', { hasText: 'Register' })).toBeVisible();
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="username"]', username);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');

    // Expect successful registration and redirection to login page
    await expect(page.locator('text=Registration successful! You can now log in.')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');

    // 2. Login
    await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');

    // Expect successful login and redirection to home page
    await expect(page).toHaveURL('http://localhost:3000/');
    // You might want to add an assertion here to check for a logged-in state,
    // e.g., a welcome message or a user profile link.
    // For now, just checking the URL.
  });

  test('should show an error for invalid login credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
    await page.fill('input[id="email"]', 'nonexistent@example.com');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});