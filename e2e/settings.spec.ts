import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

const CURRENT_PASSWORD = 'professional123';
const TEMP_PASSWORD = 'professional123X';

async function apiChangePassword(
  page: import('@playwright/test').Page,
  current: string,
  next: string,
): Promise<boolean> {
  const login = await page.request.post('/api/v1/auth/login', {
    data: { email: 'professional@example.com', password: current },
  });
  if (!login.ok()) return false;
  const { access_token } = await login.json();
  const res = await page.request.post('/api/v1/auth/change-password', {
    headers: { Authorization: `Bearer ${access_token}` },
    data: { current_password: current, new_password: next, new_password_confirm: next },
  });
  return res.ok();
}

test.describe('Settings', () => {
  // Safety: if a previous failed run left the temp password in place, restore it
  test.beforeAll(async ({ request }) => {
    const probe = await request.post('/api/v1/auth/login', {
      data: { email: 'professional@example.com', password: CURRENT_PASSWORD },
    });
    if (!probe.ok()) {
      const login = await request.post('/api/v1/auth/login', {
        data: { email: 'professional@example.com', password: TEMP_PASSWORD },
      });
      if (login.ok()) {
        const { access_token } = await login.json();
        await request.post('/api/v1/auth/change-password', {
          headers: { Authorization: `Bearer ${access_token}` },
          data: {
            current_password: TEMP_PASSWORD,
            new_password: CURRENT_PASSWORD,
            new_password_confirm: CURRENT_PASSWORD,
          },
        });
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('profile section loads with current user data', async ({ page }) => {
    const nameInput = page.locator('input#name');
    await expect(nameInput).toBeVisible({ timeout: 15000 });
    expect((await nameInput.inputValue()).trim().length).toBeGreaterThan(0);
    const emailInput = page.locator('input#email');
    await expect(emailInput).toBeDisabled();
    expect(await emailInput.inputValue()).toBe('professional@example.com');
  });

  test('profile save persists the name', async ({ page }) => {
    const nameInput = page.locator('input#name');
    const original = await nameInput.inputValue();
    await nameInput.fill('E2E Professional');
    await page.locator('[data-testid="settings-save-profile"]').click();
    await expect(page.getByText(/profil güncellendi/i)).toBeVisible({ timeout: 10000 });
    // Restore original name
    await nameInput.fill(original || 'Professional User');
    await page.locator('[data-testid="settings-save-profile"]').click();
    await expect(page.getByText(/profil güncellendi/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('wrong current password shows an error', async ({ page }) => {
    await page.locator('[data-testid="settings-current-password"]').fill('definitely-wrong');
    await page.locator('[data-testid="settings-new-password"]').fill('newpassword123');
    await page.locator('[data-testid="settings-confirm-password"]').fill('newpassword123');
    await page.locator('[data-testid="settings-change-password"]').click();
    await expect(page.getByText(/şifre güncellenemedi/i)).toBeVisible({ timeout: 10000 });
  });

  test('mismatched new passwords show a validation error', async ({ page }) => {
    await page.locator('[data-testid="settings-current-password"]').fill(CURRENT_PASSWORD);
    await page.locator('[data-testid="settings-new-password"]').fill('newpassword123');
    await page.locator('[data-testid="settings-confirm-password"]').fill('different123');
    await page.locator('[data-testid="settings-change-password"]').click();
    await expect(page.getByText(/şifreler eşleşmiyor/i)).toBeVisible({ timeout: 10000 });
  });

  test('valid password change succeeds and is reverted', async ({ page }) => {
    await page.locator('[data-testid="settings-current-password"]').fill(CURRENT_PASSWORD);
    await page.locator('[data-testid="settings-new-password"]').fill(TEMP_PASSWORD);
    await page.locator('[data-testid="settings-confirm-password"]').fill(TEMP_PASSWORD);
    await page.locator('[data-testid="settings-change-password"]').click();
    await expect(page.getByText(/şifre güncellendi/i)).toBeVisible({ timeout: 10000 });

    // Revert via API so the suite stays repeatable
    const reverted = await apiChangePassword(page, TEMP_PASSWORD, CURRENT_PASSWORD);
    expect(reverted).toBe(true);
  });

  test('preferences save shows success', async ({ page }) => {
    await page.locator('[data-testid="settings-save-preferences"]').click();
    await expect(page.getByText(/tercihler kaydedildi/i)).toBeVisible({ timeout: 10000 });
  });
});
