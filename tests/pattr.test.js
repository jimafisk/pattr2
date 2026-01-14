import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

// Load pattr.js source
const pattrSource = readFileSync('./pattr.js', 'utf-8');

describe('Pattr p-scope', () => {
  let dom;
  let window;
  let document;
  let Pattr;

  function setupPattr(html) {
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      url: 'http://localhost/',
    });
    window = dom.window;
    document = window.document;
    
    // Execute pattr.js in the JSDOM context (without auto-start)
    const script = document.createElement('script');
    script.textContent = pattrSource.replace('window.Pattr.start()', '// Auto-start disabled for tests');
    document.head.appendChild(script);
    
    Pattr = window.Pattr;
    return Pattr;
  }

  describe('Sequential Execution', () => {
    it('should execute p-scope statements in order', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"count": 5, "_p_children": {"child1": {"_p_scope": "count = count + 1; count = count * 2"}}}</script>
          </head>
          <body>
            <div id="parent" p-text="count"></div>
            <section p-id="child1" p-scope="count = count + 1; count = count * 2;">
              <div id="child" p-text="count"></div>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      // Parent count = 5
      // Child: count = 5 + 1 = 6, then count = 6 * 2 = 12
      expect(document.getElementById('parent').innerText).toBe('5');
      expect(document.getElementById('child').innerText).toBe('12');
    });

    it('should handle multiple sequential operations on same variable', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"age": 10, "_p_children": {"child1": {"_p_scope": "age = age + 1; age = age + 1; age = age * 2"}}}</script>
          </head>
          <body>
            <section p-id="child1" p-scope="age = age + 1; age = age + 1; age = age * 2;">
              <div id="result" p-text="age"></div>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      // age = 10 + 1 = 11, then 11 + 1 = 12, then 12 * 2 = 24
      expect(document.getElementById('result').innerText).toBe('24');
    });

    it('should use result of previous statement in next statement', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"_p_children": {"child1": {"_p_scope": "x = 2; y = x * 3; z = y + x"}}}</script>
          </head>
          <body>
            <section p-id="child1" p-scope="x = 2; y = x * 3; z = y + x;">
              <div id="x" p-text="x"></div>
              <div id="y" p-text="y"></div>
              <div id="z" p-text="z"></div>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      expect(document.getElementById('x').innerText).toBe('2');
      expect(document.getElementById('y').innerText).toBe('6');  // 2 * 3
      expect(document.getElementById('z').innerText).toBe('8');  // 6 + 2
    });
  });

  describe('Parent-Child Scope Inheritance', () => {
    it('should inherit values from parent scope', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"count": 5, "_p_children": {"child1": {"_p_scope": "count = count * 2"}}}</script>
          </head>
          <body>
            <div id="parent" p-text="count"></div>
            <section p-id="child1" p-scope="count = count * 2;">
              <div id="child" p-text="count"></div>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      expect(document.getElementById('parent').innerText).toBe('5');
      expect(document.getElementById('child').innerText).toBe('10');  // 5 * 2
    });

    it('should re-compute child when parent changes', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"count": 2, "_p_children": {"child1": {"_p_scope": "count = count * 2"}}}</script>
          </head>
          <body>
            <button id="btn" p-on:click="count++">+</button>
            <section p-id="child1" p-scope="count = count * 2;">
              <div id="child" p-text="count"></div>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      expect(document.getElementById('child').innerText).toBe('4');  // 2 * 2
      
      // Simulate parent count change
      document.getElementById('btn').click();
      
      // After parent count = 3, child should be 3 * 2 = 6
      expect(document.getElementById('child').innerText).toBe('6');
    });
  });

  describe('Local Variable Changes', () => {
    it('should NOT re-execute p-scope when local output variable changes', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"count": 2, "_p_children": {"seq": {"_p_scope": "count = count + 1; count = count * 2"}}}</script>
          </head>
          <body>
            <section p-id="seq" p-scope="count = count + 1; count = count * 2;">
              <div id="count" p-text="count"></div>
              <button id="btn" p-on:click="count++">+</button>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      // Initial: (2 + 1) * 2 = 6
      expect(document.getElementById('count').innerText).toBe('6');
      
      // Click + should just increment to 7, NOT re-execute p-scope
      document.getElementById('btn').click();
      expect(document.getElementById('count').innerText).toBe('7');
      
      // Another click should give 8
      document.getElementById('btn').click();
      expect(document.getElementById('count').innerText).toBe('8');
    });

    it('should re-execute p-scope when local INPUT variable changes', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{"name": "Bob", "_p_children": {"root": {"_p_scope": "coolname = name + 'cool'"}}}</script>
          </head>
          <body>
            <section p-id="root" p-scope="coolname = name + 'cool';">
              <div id="coolname" p-text="coolname"></div>
              <input id="nameInput" p-model="name" />
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      expect(document.getElementById('coolname').innerText).toBe('Bobcool');
      
      // Change name via input
      const input = document.getElementById('nameInput');
      input.value = 'Bobby';
      input.dispatchEvent(new window.Event('input'));
      
      expect(document.getElementById('coolname').innerText).toBe('Bobbycool');
    });
  });

  describe('Sibling Scope Independence', () => {
    it('should not affect sibling scopes when modifying one', async () => {
      setupPattr(`<!DOCTYPE html>
        <html>
          <head>
            <script id="p-root-data" type="application/json">{
              "count": 2,
              "_p_children": {
                "child1": {"_p_scope": "count = count * 2"},
                "child2": {"_p_scope": "count = count + 1"}
              }
            }</script>
          </head>
          <body>
            <section p-id="child1" p-scope="count = count * 2;">
              <div id="c1" p-text="count"></div>
              <button id="btn1" p-on:click="count++">+</button>
            </section>
            <section p-id="child2" p-scope="count = count + 1;">
              <div id="c2" p-text="count"></div>
            </section>
          </body>
        </html>
      `);
      
      await Pattr.start();
      
      expect(document.getElementById('c1').innerText).toBe('4');  // 2 * 2
      expect(document.getElementById('c2').innerText).toBe('3');  // 2 + 1
      
      // Click button in child1
      document.getElementById('btn1').click();
      
      // child1 should be 5 (4 + 1)
      expect(document.getElementById('c1').innerText).toBe('5');
      // child2 should still be 3 (unaffected)
      expect(document.getElementById('c2').innerText).toBe('3');
    });
  });
});
