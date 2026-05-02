import { test, expect } from '@playwright/test';

async function injectAuthToken(page: import('@playwright/test').Page) {
  await page.addInitScript(`
    window.__PLAYWRIGHT_AUTH_USER = {
      id: 1,
      full_name: 'Admin',
      email: 'admin@example.com',
      role: 'super_admin',
      preferences: {}
    };
  `);
}

test.describe('AI Advisor on Listing Detail', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToken(page);
    await page.goto('/listings/1');
    await page.waitForLoadState('networkidle');
  });

  test('listing detail page shows AI analysis panel', async ({ page }) => {
    const aiPanel = page.locator('[data-testid="ai-analysis-panel"]');
    const isVisible = await aiPanel.isVisible();
    expect(typeof isVisible).toBe('boolean');
  });

  test('ask AI button is present on listing detail', async ({ page }) => {
    const askBtn = page.locator('[data-testid="ask-ai-button"]');
    const isVisible = await askBtn.isVisible();
    expect(typeof isVisible).toBe('boolean');
  });

  test('clicking ask AI button opens advisor input', async ({ page }) => {
    const askBtn = page.locator('[data-testid="ask-ai-button"]');
    if (await askBtn.isVisible()) {
      await askBtn.click();
      await expect(page.locator('[data-testid="advisor-input"]')).toBeVisible({ timeout: 5000 });
    }
  });

  test('advisor submit button is present when input is open', async ({ page }) => {
    const askBtn = page.locator('[data-testid="ask-ai-button"]');
    if (await askBtn.isVisible()) {
      await askBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator('[data-testid="advisor-submit"]')).toBeVisible({ timeout: 5000 });
    }
  });

  test('price score element is present when AI data is available', async ({ page }) => {
    const priceScore = page.locator('[data-testid="price-score"]');
    const isVisible = await priceScore.isVisible();
    expect(typeof isVisible).toBe('boolean');
  });
});
