import { describe, it, expect } from 'vitest';
import { formatAddress, formatUSD, formatNumber } from '../lib/web3';

describe('Web3 Utilities', () => {
  it('should format long addresses correctly', () => {
    const addr = '0x1234567890abcdef1234567890abcdef12345678';
    expect(formatAddress(addr)).toBe('0x1234...5678');
  });

  it('should not shorten short addresses', () => {
    const addr = '0x123';
    expect(formatAddress(addr)).toBe('0x123');
  });

  it('should format USD values correctly', () => {
    expect(formatUSD(1234)).toBe('$1,234');
  });

  it('should format large numbers with suffixes', () => {
    expect(formatNumber(1500000)).toBe('1.50M');
    expect(formatNumber(2500)).toBe('2.5K');
    expect(formatNumber(500)).toBe('500');
  });
});
