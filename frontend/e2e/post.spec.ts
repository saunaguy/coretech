import { test, expect } from '@playwright/test';

test.describe('Post/Article functionality', () => {
  test('should allow a user to create a new post', async ({ page }) => {
    // Assuming the user is already logged in for this test.
    // In a real scenario, you might want to log in first or use a global setup.
    // For simplicity, this test assumes a logged-in state or that post creation is public.

    // Navigate to the board page
    await page.goto('http://localhost:3000/board');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1', { hasText: '게시판' })).toBeVisible(); // Assuming a title "게시판"

    // Click on a button to create a new post (adjust selector as needed)
    // Assuming there's a link or button to /board/new
    await page.click('a[href="/board/new"]');
    await expect(page).toHaveURL('http://localhost:3000/board/new');
    await expect(page.locator('h1', { hasText: '새 글 작성' })).toBeVisible(); // Assuming a title "새 글 작성"

    // Fill in the post details
    const timestamp = Date.now();
    const postTitle = `Test Post Title ${timestamp}`;
    const postBody = `This is the body of the test post created at ${new Date().toISOString()}.`;

    await page.fill('input[id="title"]', postTitle); // Assuming input with id="title"
    await page.fill('textarea[id="body"]', postBody); // Assuming textarea with id="body"

    await page.click('button[type="submit"]'); // Assuming a submit button

    // Verify that the post appears in the list (adjust selector as needed)
    // This might involve navigating back to the board or checking for a success message
    await expect(page).toHaveURL('http://localhost:3000/board'); // Assuming redirection back to board
    await expect(page.locator(`text=${postTitle}`)).toBeVisible(); // Check if the title is visible on the board
  });
});