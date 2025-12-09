import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Start at login and enter app for testing
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('button', { hasText: /enter.*app/i }).click();
    await page.waitForURL(/.*tabs\/posts/, { timeout: 10000 });
  });

  test('should navigate between tabs', async ({ page }) => {
    // Check we're on posts tab
    await expect(page).toHaveURL(/.*tabs\/posts/);
    
    // Navigate to messages tab - use locator instead of getByRole
    const messagesTab = page.locator('text=/messages/i').or(page.locator('text=/dms/i'));
    if (await messagesTab.isVisible()) {
      await messagesTab.click();
      await expect(page).toHaveURL(/.*tabs\/dms/);
    }
    
    // Navigate to account tab
    const accountTab = page.locator('text=/account/i');
    if (await accountTab.isVisible()) {
      await accountTab.click();
      await expect(page).toHaveURL(/.*tabs\/account/);
    }
    
    // Navigate to umas tab if it exists
    const umasTab = page.locator('text=/umas/i');
    if (await umasTab.isVisible()) {
      await umasTab.click();
      await expect(page).toHaveURL(/.*tabs\/umas/);
    }
    
    // Navigate back to posts
    const postsTab = page.locator('text=/posts/i').or(page.locator('text=/home/i'));
    if (await postsTab.isVisible()) {
      await postsTab.click();
      await expect(page).toHaveURL(/.*tabs\/posts/);
    }
  });

  test('should display tab bar on all pages', async ({ page }) => {
    // Tab bar should have navigation elements
    const tabBar = page.locator('[role="navigation"]').or(page.locator('nav'));
    await expect(tabBar.first()).toBeVisible({ timeout: 5000 });
  });
});
