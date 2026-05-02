import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import { useLanguage } from '../useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('defaults to tr', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('tr');
  });

  test('switchLanguage en sets localStorage to en', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.switchLanguage('en');
    });
    expect(localStorage.getItem('language')).toBe('en');
    expect(result.current.language).toBe('en');
  });

  test('switchLanguage tr sets localStorage to tr', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.switchLanguage('en');
    });
    act(() => {
      result.current.switchLanguage('tr');
    });
    expect(localStorage.getItem('language')).toBe('tr');
  });
});
