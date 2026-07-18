import { Page } from '@playwright/test';

/**
 * Log in through the real login form so the app stores real JWT tokens
 * and API-backed pages load actual data.
 *
 * Note: admin users are redirected to /admin after login,
 * professionals to /dashboard.
 */
export async function loginAs(
  page: Page,
  role: 'admin' | 'professional' = 'professional',
) {
  const credentials = {
    admin: { email: 'admin@example.com', password: 'admin123' },
    professional: { email: 'professional@example.com', password: 'professional123' },
  };
  const { email, password } = credentials[role];

  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input#password', password);
  await page.click('[data-testid="login-submit"]');
  await page.waitForURL(role === 'admin' ? '/admin' : '/dashboard', { timeout: 15000 });
}
