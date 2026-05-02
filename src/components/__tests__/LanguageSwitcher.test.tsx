import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import { LanguageSwitcher } from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders TR and EN buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByTestId('lang-switch-tr')).toBeInTheDocument();
    expect(screen.getByTestId('lang-switch-en')).toBeInTheDocument();
  });

  test('clicking EN sets localStorage to en', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByTestId('lang-switch-en'));
    expect(localStorage.getItem('language')).toBe('en');
  });

  test('clicking TR sets localStorage to tr', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByTestId('lang-switch-en'));
    fireEvent.click(screen.getByTestId('lang-switch-tr'));
    expect(localStorage.getItem('language')).toBe('tr');
  });
});
