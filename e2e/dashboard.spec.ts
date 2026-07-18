import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
  });

  test('stats cards render with values', async ({ page }) => {
    const cards = page.locator('[data-testid="dashboard-stat-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const text = (await cards.nth(i).innerText()).trim();
      expect(text.length).toBeGreaterThan(0);
      expect(text).not.toContain('undefined');
      expect(text).not.toContain('[object Object]');
    }
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
    const heading = (await page.locator('h1, h2').first().innerText()).trim();
    expect(heading.length).toBeGreaterThan(0);
  });

  test('no undefined or object dumps visible', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('undefined');
    expect(body).not.toContain('[object Object]');
  });

  test('nav links are visible and labeled', async ({ page }) => {
    for (const nav of ['nav-dashboard', 'nav-search', 'nav-listings', 'nav-import', 'nav-favorites']) {
      const link = page.locator(`[data-testid="${nav}"]`).first();
      await expect(link).toBeVisible();
      expect(((await link.innerText()) || '').trim().length).toBeGreaterThan(0);
    }
  });
});
