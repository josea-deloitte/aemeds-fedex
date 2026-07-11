/**
 * FedEx site data extractor
 *
 * Navigates to fedex.com, dismisses modals, opens the Shipping nav dropdown,
 * then extracts computed colours and SVG icon URLs from the header and footer.
 * Results are written to fedex-data.json.
 *
 * Usage:
 *   npm install -D playwright
 *   npx playwright install chromium
 *   node extract-fedex-data.js
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const TARGET_URL = 'https://www.fedex.com/en-us/home.html';
const OUTPUT_FILE = 'fedex-data.json';

// ─── helpers ──────────────────────────────────────────────────────────────────

async function waitSeconds(page, seconds) {
  await page.waitForTimeout(seconds * 1000);
}

/**
 * Try multiple selectors in order; click the first one found within `timeout` ms.
 * Returns true if clicked, false if nothing matched.
 */
async function tryClick(page, selectors, timeout = 5000) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ state: 'visible', timeout });
      await el.click();
      console.log(`  ✓ clicked: ${sel}`);
      return true;
    } catch {
      // try next selector
    }
  }
  console.warn(`  ✗ no element found for: ${selectors.join(' | ')}`);
  return false;
}

// ─── extraction helpers (run inside the browser) ───────────────────────────

function getComputedColorMap(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return null;

  const pick = (sel) => {
    const el = root.querySelector(sel) || document.querySelector(sel);
    if (!el) return null;
    const s = window.getComputedStyle(el);
    return {
      background: s.backgroundColor,
      color: s.color,
      borderColor: s.borderColor,
    };
  };

  return {
    root: pick(rootSelector),
    navBar: pick(`${rootSelector} nav, ${rootSelector} [role="banner"]`),
    brandLink: pick(`${rootSelector} a`),
    navItem: pick(`${rootSelector} li`),
    dropdownPanel: pick(`${rootSelector} [aria-expanded="true"] ul, ${rootSelector} ul ul`),
    button: pick(`${rootSelector} button`),
    toolsArea: pick(`${rootSelector} .nav-tools, ${rootSelector} [class*="tools"]`),
  };
}

function getSvgUrls(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return [];
  const urls = new Set();

  // inline SVG hrefs and src
  root.querySelectorAll('use[href], use[xlink\\:href]').forEach((use) => {
    const href = use.getAttribute('href') || use.getAttribute('xlink:href');
    if (href) urls.add(new URL(href, window.location.href).href);
  });

  // img tags with .svg src
  root.querySelectorAll('img[src*=".svg"]').forEach((img) => {
    urls.add(new URL(img.src, window.location.href).href);
  });

  // background-image SVGs
  root.querySelectorAll('*').forEach((el) => {
    const bg = window.getComputedStyle(el).backgroundImage;
    const match = bg.match(/url\(["']?([^"')]+\.svg[^"')]*)/i);
    if (match) urls.add(new URL(match[1], window.location.href).href);
  });

  return [...urls];
}

function getHtmlSnippet(selector, maxLength = 2000) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const html = el.outerHTML;
  return html.length > maxLength ? `${html.slice(0, maxLength)}…[truncated]` : html;
}

function getAllComputedColors(selector) {
  const el = document.querySelector(selector);
  if (!el) return {};
  const colors = {};
  el.querySelectorAll('*').forEach((node) => {
    const s = window.getComputedStyle(node);
    ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'fill', 'stroke'].forEach((prop) => {
      const val = s[prop];
      if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent') {
        if (!colors[val]) colors[val] = [];
        const label = (node.className || node.tagName).toString().slice(0, 60);
        if (!colors[val].includes(label)) colors[val].push(label);
      }
    });
  });
  // sort by usage frequency
  return Object.fromEntries(
    Object.entries(colors).sort(([, a], [, b]) => b.length - a.length),
  );
}

// ─── main ──────────────────────────────────────────────────────────────────

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // ── Step 1: navigate ──────────────────────────────────────────────────
    console.log('1. Navigating to FedEx…');
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // ── Step 2: wait 3 s ─────────────────────────────────────────────────
    console.log('2. Waiting 3 s…');
    await waitSeconds(page, 3);

    // ── Step 3: language/location modal → click English ──────────────────
    console.log('3. Looking for language modal…');
    await tryClick(page, [
      'button:has-text("English")',
      '[data-testid="language-modal"] button:has-text("English")',
      '.language-selector button:has-text("English")',
      '[aria-label*="English"]',
      'button[value="en"]',
      '.modal button:has-text("English")',
    ]);

    // ── Step 4: wait 3 s ─────────────────────────────────────────────────
    console.log('4. Waiting 3 s…');
    await waitSeconds(page, 3);

    // ── Step 5: cookie consent → accept all ──────────────────────────────
    console.log('5. Looking for cookie consent…');
    await tryClick(page, [
      'button:has-text("ACCEPT ALL COOKIES")',
      'button:has-text("Accept All Cookies")',
      'button:has-text("Accept all cookies")',
      '#onetrust-accept-btn-handler',
      '[data-testid="cookie-accept-all"]',
      '.cookie-banner button:has-text("Accept")',
      '[class*="cookie"] button:has-text("Accept")',
    ]);

    // ── Step 6: click Shipping in main nav ────────────────────────────────
    console.log('6. Opening Shipping dropdown…');
    await waitSeconds(page, 1);
    await tryClick(page, [
      'nav button:has-text("Shipping")',
      'nav a:has-text("Shipping")',
      '[role="navigation"] li:has-text("Shipping")',
      'header li:has-text("Shipping")',
    ]);
    await waitSeconds(page, 1);

    // ── Step 7 & 8: extract colours and SVG URLs ──────────────────────────
    console.log('7–8. Extracting colours and SVGs…');

    const headerColors = await page.evaluate(getComputedColorMap, 'header');
    const footerColors = await page.evaluate(getComputedColorMap, 'footer');
    const headerAllColors = await page.evaluate(getAllComputedColors, 'header');
    const footerAllColors = await page.evaluate(getAllComputedColors, 'footer');
    const headerSvgs = await page.evaluate(getSvgUrls, 'header');
    const footerSvgs = await page.evaluate(getSvgUrls, 'footer');
    const headerHtml = await page.evaluate(getHtmlSnippet, 'header');
    const footerHtml = await page.evaluate(getHtmlSnippet, 'footer');

    // ── Step 9: save ──────────────────────────────────────────────────────
    const result = {
      extractedAt: new Date().toISOString(),
      sourceUrl: page.url(),
      header: {
        computedColors: headerColors,
        allColors: headerAllColors,
        svgUrls: headerSvgs,
        htmlSnippet: headerHtml,
      },
      footer: {
        computedColors: footerColors,
        allColors: footerAllColors,
        svgUrls: footerSvgs,
        htmlSnippet: footerHtml,
      },
    };

    writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
    console.log(`\n✅  Saved to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Error during extraction:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
