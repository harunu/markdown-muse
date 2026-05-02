import { test, expect } from '@playwright/test';

/**
 * Set up auth by injecting a user object on window.__PLAYWRIGHT_AUTH_USER.
 * AuthContext reads this in its checkAuth() useEffect and skips the API call.
 * addInitScript runs in the isolated world but window properties ARE shared
 * with the main world, so this reliably bypasses the auth check.
 */
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

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/e-posta/i)).toBeVisible();
    await expect(page.getByLabel(/şifre/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible();
  });

  test('shows validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page.getByText(/lütfen e-posta ve şifre giriniz/i)).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill('invalid@example.com');
    await page.getByLabel(/şifre/i).fill('wrongpassword');
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(
      page.locator('[data-testid="error-message"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test('protected route accessible after auth injection', async ({ page }) => {
    await injectAuthToken(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL('/login', { timeout: 10000 });
  });

  test('logout button is visible when authenticated', async ({ page }) => {
    await injectAuthToken(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 });
  });
});
