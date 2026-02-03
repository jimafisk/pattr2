import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('p-style directive', () => {
  it('should apply styles from object', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"bgColor": "red", "fontSize": "20px"}</script>
        </head>
        <body>
          <div id="test" p-style="{'backgroundColor': bgColor, 'fontSize': fontSize}"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    const style = document.getElementById('test').style;
    expect(style.backgroundColor).toBe('red');
    expect(style.fontSize).toBe('20px');
  });

  it('should apply styles from string', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"visible": true}</script>
        </head>
        <body>
          <div id="test" p-style="visible ? 'color: green' : 'color: red'"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').style.color).toBe('green');
  });
});
