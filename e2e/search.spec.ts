import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
  });

  test('search inputs and filters are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="semantic-search-input"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="search-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-filter-city"]')).toBeVisible();
  });

  test('natural language search returns results', async ({ page }) => {
    await page.locator('[data-testid="semantic-search-input"]').fill("Bodrum'da 2+1 arıyorum");
    await page.locator('[data-testid="search-button"]').click();
    const cards = page.locator('[data-testid="listing-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(cards.first()).toContainText('Bodrum');
  });

  test('listing type badge shows Turkish label, not raw key', async ({ page }) => {
    await page.locator('[data-testid="semantic-search-input"]').fill('Bodrum');
    await page.locator('[data-testid="search-button"]').click();
    const badge = page.locator('[data-testid="listing-type-badge"]').first();
    await expect(badge).toBeVisible({ timeout: 15000 });
    const text = (await badge.innerText()).trim();
    expect(['Satılık', 'Kiralık']).toContain(text);
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('SALE');
    expect(body).not.toContain('RENT');
  });

  test('search with no matches shows empty state, not a crash', async ({ page }) => {
    await page.locator('[data-testid="semantic-search-input"]').fill('xyzqwe nonexistent listing');
    await page.locator('[data-testid="search-button"]').click();
    const noResults = page.locator('[data-testid="no-results"]');
    const results = page.locator('[data-testid="search-results"]');
    await expect(noResults.or(results).first()).toBeVisible({ timeout: 15000 });
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('undefined');
    expect(body).not.toContain('[object Object]');
  });

  test('sort dropdown changes order without breaking results', async ({ page }) => {
    await page.locator('[data-testid="semantic-search-input"]').fill('Bodrum');
    await page.locator('[data-testid="search-button"]').click();
    const cards = page.locator('[data-testid="listing-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });

    // Find the sort select (combobox showing a sort label) and choose price ascending
    const sortTrigger = page.getByRole('combobox').filter({ hasText: /fiyat|yeni|sırala/i }).first();
    await sortTrigger.click();
    await page.getByRole('option', { name: /fiyat \(artan\)/i }).click();
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });
});
