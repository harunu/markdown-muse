import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Listings', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
    await page.goto('/listings');
    await page.waitForLoadState('networkidle');
  });

  test('listings table loads with data', async ({ page }) => {
    const rows = page.locator('[data-testid="listing-row"]');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('status badges show Turkish labels, not raw keys', async ({ page }) => {
    const badges = page.locator('[data-testid="listing-status-badge"]');
    await expect(badges.first()).toBeVisible({ timeout: 15000 });
    const count = await badges.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = (await badges.nth(i).innerText()).trim();
      expect(['Aktif', 'Pasif', 'Taslak']).toContain(text);
    }
    // Raw uppercase keys must never render
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('ACTIVE');
    expect(body).not.toContain('PASSIVE');
    expect(body).not.toContain('DRAFT');
  });

  test('filter by city narrows results', async ({ page }) => {
    const rows = page.locator('[data-testid="listing-row"]');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });

    // Open the city select and pick Muğla
    const citySelect = page.locator('button[role="combobox"]').first();
    await citySelect.click();
    await page.getByRole('option', { name: 'Muğla' }).click();

    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(rows.nth(i)).toContainText('Muğla');
    }
  });

  test('opening a listing shows populated detail page', async ({ page }) => {
    const rows = page.locator('[data-testid="listing-row"]');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });

    // Open the row actions menu and click "Görüntüle"
    await rows.first().hover();
    await rows.first().locator('button').last().click();
    await page.getByRole('menuitem', { name: /görüntüle/i }).click();

    await page.waitForURL(/\/listings\/\d+/, { timeout: 10000 });

    // Listing type badge shows Turkish label, not the raw key
    await expect(page.getByText(/Satılık|Kiralık/).first()).toBeVisible({ timeout: 15000 });
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('SALE');
    expect(body).not.toContain('RENT');
    expect(body).not.toContain('undefined');

    // Title heading is present and non-empty
    const heading = (await page.locator('h1, h2').first().innerText()).trim();
    expect(heading.length).toBeGreaterThan(0);
  });
});
