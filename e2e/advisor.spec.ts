import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

/**
 * Opens the first listing's detail page via the listings table.
 */
async function openFirstListing(page: import('@playwright/test').Page) {
  await page.goto('/listings');
  const row = page.locator('[data-testid="listing-row"]').first();
  await expect(row).toBeVisible({ timeout: 15000 });
  await row.hover();
  await row.locator('button').last().click();
  await page.getByRole('menuitem', { name: /görüntüle/i }).click();
  await page.waitForURL(/\/listings\/\d+/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
}

test.describe('AI Advisor on Listing Detail', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
    await openFirstListing(page);
  });

  test('AI analysis panel is present on the detail page', async ({ page }) => {
    await expect(page.locator('[data-testid="ai-analysis-panel"]')).toBeVisible({ timeout: 15000 });
  });

  test('ask AI button opens the advisor input', async ({ page }) => {
    const askBtn = page.locator('[data-testid="advisor-ask-button"]');
    await expect(askBtn).toBeVisible({ timeout: 15000 });
    await askBtn.click();
    await expect(page.locator('[data-testid="advisor-input"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="advisor-submit"]')).toBeVisible();
  });

  test('advisor input accepts a question', async ({ page }) => {
    await page.locator('[data-testid="advisor-ask-button"]').click();
    const input = page.locator('[data-testid="advisor-input"]');
    await input.fill('Bu fiyat piyasaya göre makul mü?');
    expect(await input.inputValue()).toContain('makul');
    // NOTE: actual answer assertion requires a configured LLM backend;
    // covered by backend tests with mocks (apps/ai/tests/test_advisor.py).
  });

  test('detail page shows no raw price label keys', async ({ page }) => {
    const body = await page.locator('body').innerText();
    // Raw stable keys like "very_high"/"good" must not render as-is
    expect(body).not.toMatch(/\bvery_high\b/);
    expect(body).not.toContain('[object Object]');
    expect(body).not.toContain('undefined');
  });
});
