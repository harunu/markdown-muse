import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginAs } from './helpers/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixture = (name: string) => path.join(__dirname, 'fixtures', name);

test.describe('CSV Import', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'professional');
    await page.goto('/import');
    await page.waitForLoadState('networkidle');
  });

  test('import page loads with dropzone and template button', async ({ page }) => {
    await expect(page.locator('[data-testid="import-dropzone"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="download-template"]')).toBeVisible();
    await expect(page.locator('[data-testid="import-file-input"]')).toBeAttached();
  });

  test('template download produces a CSV file', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    await page.locator('[data-testid="download-template"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('uploading a valid CSV shows preview with confirm button', async ({ page }) => {
    await page.locator('[data-testid="import-file-input"]').setInputFiles(fixture('valid-import.csv'));
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('[data-testid="import-confirm"]')).toBeVisible();
    const preview = await page.locator('[data-testid="import-preview"]').innerText();
    expect(preview).not.toContain('undefined');
  });

  test('uploading an invalid CSV reports error rows clearly', async ({ page }) => {
    await page.locator('[data-testid="import-file-input"]').setInputFiles(fixture('invalid-import.csv'));
    await expect(page.locator('[data-testid="import-preview"]')).toBeVisible({ timeout: 20000 });
    // 4 of 5 rows are invalid — the preview must surface errored rows
    await expect(page.getByText(/satır hatalı/i)).toBeVisible({ timeout: 15000 });
    // Expand the error list and check details are shown per row
    const toggle = page.getByText(/hataları görüntüle/i);
    await toggle.click();
    await expect(page.getByText(/satır \d+/i).first()).toBeVisible();
  });

  test('confirming a valid import completes with readable status', async ({ page }) => {
    await page.locator('[data-testid="import-file-input"]').setInputFiles(fixture('valid-import.csv'));
    await expect(page.locator('[data-testid="import-confirm"]')).toBeVisible({ timeout: 20000 });
    await page.locator('[data-testid="import-confirm"]').click();
    const completion = page.locator('[data-testid="import-history"]');
    await expect(completion).toBeVisible({ timeout: 30000 });
    await expect(completion).toContainText(/tamamlandı|başarısız/i);
    // Raw status keys must not leak into the UI
    const text = await completion.innerText();
    expect(text).not.toContain('completed');
    expect(text).not.toContain('pending_confirmation');
  });
});
