import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

async function getToken(page: import('@playwright/test').Page): Promise<string> {
  return page.evaluate(
    () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '',
  );
}

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
  });

  test('add favorite, edit note, then remove', async ({ page }) => {
    // Start from a clean slate: remove any favorites left by earlier runs
    const token = await getToken(page);
    const existing = await page.request.get('/api/v1/favorites/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (existing.ok()) {
      const data = await existing.json();
      const items = data.results ?? data.data ?? [];
      for (const item of items) {
        await page.request.delete(`/api/v1/favorites/${item.property.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    // Add via search page star toggle
    await page.goto('/search');
    await page.locator('[data-testid="semantic-search-input"]').fill('Bodrum');
    await page.locator('[data-testid="search-button"]').click();
    const card = page.locator('[data-testid="listing-card"]').first();
    await expect(card).toBeVisible({ timeout: 15000 });

    // Click the star and wait for the add request to finish before navigating
    const addResponse = page.waitForResponse(
      (r) => r.url().includes('/favorites') && r.request().method() === 'POST',
      { timeout: 15000 },
    );
    await card.locator('[data-testid="favorite-toggle"]').click();
    await addResponse;

    // Verify it appears on the favorites page
    await page.goto('/favorites');
    const favCard = page.locator('[data-testid="favorite-card"]').first();
    await expect(favCard).toBeVisible({ timeout: 15000 });

    // Add a note
    await favCard.locator('[data-testid="favorite-note-button"]').click();
    await page.locator('[data-testid="favorite-note-input"]').fill('E2E test notu');
    await page.locator('[data-testid="favorite-note-save"]').click();
    await expect(page.locator('[data-testid="favorite-note-input"]')).toBeHidden({ timeout: 10000 });
    await expect(favCard).toContainText('E2E test notu');

    // Remove and verify the count decreases
    const before = await page.locator('[data-testid="favorite-card"]').count();
    await favCard.locator('[data-testid="favorite-remove"]').click();
    await expect(page.locator('[data-testid="favorite-card"]')).toHaveCount(before - 1, { timeout: 10000 });
  });

  test('duplicate favorite returns conflict error, not a crash', async ({ page }) => {
    const token = await getToken(page);
    expect(token.length).toBeGreaterThan(0);

    // Pick a real property id from the API
    const listRes = await page.request.get('/api/v1/properties?page_size=1', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(listRes.ok()).toBeTruthy();
    const listData = await listRes.json();
    const propertyId = (listData.results?.[0] ?? listData.data?.[0])?.id;
    expect(propertyId).toBeTruthy();

    const add = () =>
      page.request.post('/api/v1/favorites/', {
        headers: { Authorization: `Bearer ${token}` },
        data: { property_id: propertyId },
      });

    const first = await add();
    const second = await add();

    // One of the two must be the conflict (first may already exist from earlier runs)
    const conflict = first.status() === 409 ? first : second;
    expect(conflict.status()).toBe(409);
    const body = await conflict.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('ALREADY_FAVORITE');

    // Cleanup so this test is repeatable
    await page.request.delete(`/api/v1/favorites/${propertyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  test('favorites page shows empty state or cards without errors', async ({ page }) => {
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('undefined');
    expect(body).not.toContain('[object Object]');
  });
});
