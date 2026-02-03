import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('p-show directive', () => {
  it('should show element when true', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"visible": true}</script>
        </head>
        <body>
          <div id="test" p-show="visible">Content</div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').style.display).not.toBe('none');
  });

  it('should hide element when false', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"visible": false}</script>
        </head>
        <body>
          <div id="test" p-show="visible">Content</div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').style.display).toBe('none');
  });

  it('should evaluate expressions', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"count": 5}</script>
        </head>
        <body>
          <div id="test" p-show="count > 3">Content</div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').style.display).not.toBe('none');
  });
});
