import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

// Load pattr.js source
export const pattrSource = readFileSync('./pattr.js', 'utf-8');

export function setupPattr(html) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
  });
  const window = dom.window;
  const document = window.document;
  
  // Execute pattr.js in the JSDOM context (without auto-start)
  const script = document.createElement('script');
  script.textContent = pattrSource.replace('window.Pattr.start()', '// Auto-start disabled for tests');
  document.head.appendChild(script);
  
  return { dom, window, document, Pattr: window.Pattr };
}
