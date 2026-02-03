import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('parseDirectiveModifiers', () => {
  it('should parse single modifier', () => {
    const { Pattr } = setupPattr(`<!DOCTYPE html><html><head></head><body></body></html>`);
    
    const result = Pattr.parseDirectiveModifiers('p-html:trim.100');
    
    expect(result.directive).toBe('p-html');
    expect(result.modifiers.trim).toEqual(['100']);
  });

  it('should parse multiple modifiers', () => {
    const { Pattr } = setupPattr(`<!DOCTYPE html><html><head></head><body></body></html>`);
    
    const result = Pattr.parseDirectiveModifiers('p-html:allow.strong.em:trim.50');
    
    expect(result.directive).toBe('p-html');
    expect(result.modifiers.allow).toEqual(['strong', 'em']);
    expect(result.modifiers.trim).toEqual(['50']);
  });

  it('should handle directive without modifiers', () => {
    const { Pattr } = setupPattr(`<!DOCTYPE html><html><head></head><body></body></html>`);
    
    const result = Pattr.parseDirectiveModifiers('p-text');
    
    expect(result.directive).toBe('p-text');
    expect(result.modifiers).toEqual({});
  });
});
