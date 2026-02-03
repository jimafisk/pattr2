import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('p-html directive', () => {
  it('should render HTML content', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"content": "<strong>Bold</strong> text"}</script>
        </head>
        <body>
          <div id="test" p-html="content"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    const el = document.getElementById('test');
    expect(el.innerHTML).toBe('<strong>Bold</strong> text');
    expect(el.querySelector('strong')).not.toBeNull();
  });

  it('should filter tags with allow modifier', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"content": "<strong>Bold</strong><script>alert('xss')<\\/script>"}</script>
        </head>
        <body>
          <div id="test" p-html:allow.strong="content"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    const el = document.getElementById('test');
    expect(el.querySelector('strong')).not.toBeNull();
    expect(el.querySelector('script')).toBeNull();
  });

  it('should trim HTML while preserving structure', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"content": "<em>This is a long text that should be trimmed</em>"}</script>
        </head>
        <body>
          <div id="test" p-html:trim.10="content"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    const el = document.getElementById('test');
    // Use textContent instead of innerText (JSDOM compatibility)
    expect(el.textContent.length).toBeLessThanOrEqual(13); // 10 + "..."
    expect(el.querySelector('em')).not.toBeNull();
  });
});
