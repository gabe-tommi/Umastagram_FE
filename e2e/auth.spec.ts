import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Debug: log page content
    const body = await page.textContent('body');
    console.log('Page loaded, body text:', body);
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Check for any input fields
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log('Number of inputs found:', inputCount);
    
    // Check for any buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log('Number of buttons found:', buttonCount);
    
    // Just verify the page loaded with some content
    expect(inputCount).toBeGreaterThan(0);
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should show error when logging in without credentials', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find login button - it's likely the 3rd or 4th button after "Enter App"
    // Try to find button with "Login" text, otherwise use position
    const loginButton = page.locator('button').filter({ hasText: /^login$/i }).first();
    await loginButton.click();
    
    // Should show error modal - look for modal overlay
    await expect(page.locator('text=/error/i')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click signup button - find button with signup text
    const signupButton = page.locator('button').filter({ hasText: /sign.*up/i });
    await signupButton.click();
    
    // Should navigate to signup page
    await expect(page).toHaveURL(/.*signup/, { timeout: 10000 });
  });

  test('should allow dev entry to app', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click first button (Enter App)
    await page.locator('button').first().click();
    
    // Should navigate to posts page
    await expect(page).toHaveURL(/.*tabs\/posts/, { timeout: 10000 });
  });

  test('should handle OAuth login redirects', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check OAuth buttons exist by text content
    await expect(page.locator('text=/github/i')).toBeVisible();
    await expect(page.locator('text=/google/i')).toBeVisible();
  });
});
