import { describe, it, expect } from 'vitest';
import { setupPattr } from './setup.js';

describe('p-class directive', () => {
  it('should apply class from string', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"myClass": "active"}</script>
        </head>
        <body>
          <div id="test" p-class="myClass"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').className).toBe('active');
  });

  it('should apply classes from array', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"classes": ["one", "two", "three"]}</script>
        </head>
        <body>
          <div id="test" p-class="classes"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').className).toBe('one two three');
  });

  it('should apply conditional classes from object', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"isActive": true, "isDisabled": false}</script>
        </head>
        <body>
          <div id="test" p-class="{'active': isActive, 'disabled': isDisabled}"></div>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    const className = document.getElementById('test').className;
    expect(className).toContain('active');
    expect(className).not.toContain('disabled');
  });

  it('should update classes when value changes', async () => {
    const { document, Pattr } = setupPattr(`<!DOCTYPE html>
      <html>
        <head>
          <script id="p-root-data" type="application/json">{"isActive": false}</script>
        </head>
        <body>
          <div id="test" p-class="{'active': isActive}"></div>
          <button id="btn" p-on:click="isActive = !isActive">Toggle</button>
        </body>
      </html>
    `);
    
    await Pattr.start();
    
    expect(document.getElementById('test').className).not.toContain('active');
    
    document.getElementById('btn').click();
    
    expect(document.getElementById('test').className).toContain('active');
  });
});
