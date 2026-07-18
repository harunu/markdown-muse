import { test, expect, Page } from '@playwright/test';
import { loginAs } from './helpers/auth';

const PAGES = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/search', name: 'Search' },
  { path: '/listings', name: 'Listings' },
  { path: '/import', name: 'Import' },
  { path: '/favorites', name: 'Favorites' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' },
];

// Raw backend keys that must never be rendered to the user
const RAW_KEYS = [
  'SALE',
  'RENT',
  'APARTMENT',
  'ACTIVE',
  'PASSIVE',
  'DRAFT',
  'PROFESSIONAL',
  'undefined',
  '[object Object]',
];

async function assertPageIsClean(page: Page, name: string) {
  const body = await page.locator('body').innerText();
  for (const key of RAW_KEYS) {
    expect(body, `${name}: raw key "${key}" must not be visible`).not.toContain(key);
  }
}

test.describe('UI Layout', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
  });

  for (const { path, name } of PAGES) {
    test(`${name} page renders cleanly`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Heading present and non-empty
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 15000 });
      expect(((await heading.innerText()) || '').trim().length).toBeGreaterThan(0);

      // No raw keys, undefined, or object dumps anywhere
      await assertPageIsClean(page, name);

      // No horizontal overflow at 1280x800
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${name}: page must not scroll horizontally`).toBeLessThanOrEqual(0);

      // All visible buttons have an accessible label (text, aria-label, icon,
      // aria-labelledby, or an associated <label for=...>). Checkbox/switch
      // primitives are labeled externally via htmlFor, so they are skipped.
      const emptyButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.filter((b) => {
          if (b.offsetParent === null) return false; // hidden
          const role = b.getAttribute('role');
          if (role === 'checkbox' || role === 'switch') return false;
          const hasText = (b.textContent || '').trim().length > 0;
          const hasAria = !!b.getAttribute('aria-label') || !!b.getAttribute('aria-labelledby');
          const hasIcon = b.querySelector('svg, img') !== null;
          const hasLabelFor = !!b.id && !!document.querySelector(`label[for="${b.id}"]`);
          return !hasText && !hasAria && !hasIcon && !hasLabelFor;
        }).length;
      });
      expect(emptyButtons, `${name}: no button may be empty`).toBe(0);
    });
  }
});
