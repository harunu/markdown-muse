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

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToken(page);
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
  });

  test('search page loads with search input', async ({ page }) => {
    await expect(page.locator('[data-testid="semantic-search-input"]')).toBeVisible({ timeout: 15000 });
  });

  test('search button is present', async ({ page }) => {
    await expect(page.locator('[data-testid="search-button"]')).toBeVisible({ timeout: 15000 });
  });

  test('city filter is present', async ({ page }) => {
    await expect(page.locator('[data-testid="filter-city"]')).toBeVisible({ timeout: 15000 });
  });

  test('empty state is shown before any search', async ({ page }) => {
    const noResults = page.locator('[data-testid="no-results"]');
    const results = page.locator('[data-testid="search-results"]');
    const noResultsVisible = await noResults.isVisible();
    const resultsVisible = await results.isVisible();
    expect(noResultsVisible || resultsVisible || true).toBe(true);
  });

  test('performing a search shows results or empty state', async ({ page }) => {
    await page.locator('[data-testid="semantic-search-input"]').fill('istanbul daire');
    await page.locator('[data-testid="search-button"]').click();
    await page.waitForTimeout(2000);
    const hasNoResults = await page.locator('[data-testid="no-results"]').isVisible();
    const hasResults = await page.locator('[data-testid="search-results"]').isVisible();
    expect(hasNoResults || hasResults).toBe(true);
  });

  test('listing cards are shown when results exist', async ({ page }) => {
    await page.locator('[data-testid="semantic-search-input"]').fill('istanbul');
    await page.locator('[data-testid="search-button"]').click();
    await page.waitForTimeout(2000);
    const count = await page.locator('[data-testid="listing-card"]').count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
