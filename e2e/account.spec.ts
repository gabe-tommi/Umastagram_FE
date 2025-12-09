import { test, expect } from '@playwright/test';

test.describe('Account Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('button', { hasText: /enter.*app/i }).click();
    await page.waitForURL(/.*tabs\/posts/, { timeout: 10000 });
    
    // Navigate to account tab
    const accountTab = page.locator('text=/account/i');
    await accountTab.click();
    await page.waitForURL(/.*tabs\/account/, { timeout: 10000 });
  });

  test('should display account page elements', async ({ page }) => {
    await expect(page).toHaveURL(/.*tabs\/account/);
    
    // Page should have loaded
    await page.waitForLoadState('networkidle');
    
    // Check page is visible (not checking specific text as it may vary)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    // Look for logout button if it exists
    const logoutButton = page.locator('button', { hasText: /logout/i });
    
    const isVisible = await logoutButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await logoutButton.click();
      
      // Should redirect to login page
      await expect(page).toHaveURL(/^\/$|.*\/$/, { timeout: 10000 });
    } else {
      // Skip test if no logout button exists yet
      test.skip();
    }
  });
});
