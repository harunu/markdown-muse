import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/e-posta/i)).toBeVisible();
    await expect(page.getByLabel(/şifre/i)).toBeVisible();
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });

  test('shows validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-testid="login-submit"]').click();
    await expect(page.getByText(/lütfen e-posta ve şifre giriniz/i)).toBeVisible();
  });

  test('shows translated error on invalid credentials, not a raw code', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill('invalid@example.com');
    await page.locator('input#password').fill('wrongpassword');
    await page.locator('[data-testid="login-submit"]').click();
    const error = page.locator('[data-testid="error-message"]');
    await expect(error).toBeVisible({ timeout: 10000 });
    await expect(error).not.toContainText('AUTHENTICATION_FAILED');
    await expect(error).not.toContainText('AUTH_FAILED');
  });

  test('valid professional login redirects to dashboard', async ({ page }) => {
    await loginAs(page, 'professional');
    await expect(page).toHaveURL('/dashboard');
  });

  test('valid admin login redirects to admin panel', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL('/admin');
  });

  test('unauthenticated access to /dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page).toHaveURL('/login');
  });

  test('session persists across direct navigation to protected routes', async ({ page }) => {
    await loginAs(page, 'professional');
    await page.goto('/listings');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL('/login', { timeout: 10000 });
  });

  test('logout redirects to login and clears tokens', async ({ page }) => {
    await loginAs(page, 'professional');
    await page.locator('[data-testid="logout-button"]').click();
    await page.waitForURL('/login', { timeout: 10000 });
    const token = await page.evaluate(
      () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token'),
    );
    expect(token).toBeNull();
  });
});
