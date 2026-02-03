import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('p-text directive', () => {
  it('should display computed expression', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"a": 5, "b": 3}</script>
        </head>
        <body>
          <div id="test" p-text="a + b"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').innerText).toBe('8');
  });

  it('should handle null/undefined gracefully', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"value": null}</script>
        </head>
        <body>
          <div id="test" p-text="value"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').innerText).toBe('null');
  });
});
