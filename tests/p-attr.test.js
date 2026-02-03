import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('p-attr directive', () => {
  it('should remove attribute when value is null', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"isDisabled": null}</script>
        </head>
        <body>
          <button id="test" disabled p-attr:disabled="isDisabled">Click</button>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').hasAttribute('disabled')).toBe(false);
  });

  it('should remove attribute when value is false', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"isDisabled": false}</script>
        </head>
        <body>
          <button id="test" disabled p-attr:disabled="isDisabled">Click</button>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').hasAttribute('disabled')).toBe(false);
  });

  it('should set multiple attributes with object', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"id": "123", "role": "button"}</script>
        </head>
        <body>
          <div id="test" p-attr="{'data-id': id, 'data-role': role}"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    const el = document.getElementById('test');
    expect(el.getAttribute('data-id')).toBe('123');
    expect(el.getAttribute('data-role')).toBe('button');
  });
});
