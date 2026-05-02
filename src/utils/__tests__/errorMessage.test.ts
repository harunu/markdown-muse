import { describe, test, expect, beforeEach } from 'vitest';
import { getErrorMessage } from '../errorMessage';

describe('getErrorMessage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns Turkish message for AUTH_FAILED by default', () => {
    localStorage.setItem('language', 'tr');
    const msg = getErrorMessage('AUTH_FAILED', 'auth');
    expect(msg).toBe('Geçersiz e-posta veya şifre.');
  });

  test('returns English message for AUTH_FAILED when en', () => {
    localStorage.setItem('language', 'en');
    const msg = getErrorMessage('AUTH_FAILED', 'auth', 'en');
    expect(msg).toBe('Invalid email or password.');
  });

  test('unknown code falls back to SERVER_ERROR', () => {
    const msg = getErrorMessage('UNKNOWN_CODE_XYZ', 'common', 'tr');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });
});
