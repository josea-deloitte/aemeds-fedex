import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// project desktop breakpoint: nav switches from drawer to horizontal bar
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Closes every open dropdown in the nav.
 * @param {Element} nav The nav element
 * @param {Element} [except] Trigger button to leave untouched
 */
function closeDropdowns(nav, except = null) {
  nav.querySelectorAll('.nav-item-drop > .nav-link[aria-expanded="true"]').forEach((btn) => {
    if (btn !== except) btn.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Opens or closes the mobile drawer.
 * @param {Element} nav The nav element
 * @param {Boolean} [force] Force open (true) or closed (false)
 */
function toggleDrawer(nav, force = null) {
  const hamburger = nav.querySelector('.nav-hamburger');
  const open = force !== null ? force : hamburger.getAttribute('aria-expanded') !== 'true';
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('nav-open', open);
  document.body.style.overflowY = open && !isDesktop.matches ? 'hidden' : '';
  if (!open) closeDropdowns(nav);
}

/**
 * Replaces a broken/missing brand image with a FedEx-style text wordmark.
 * @param {Element} link The brand link
 */
function swapToWordmark(link) {
  link.textContent = '';
  const wordmark = document.createElement('span');
  wordmark.className = 'nav-brand-wordmark';
  wordmark.setAttribute('aria-hidden', 'true');
  wordmark.innerHTML = 'Fed<span>Ex</span>';
  link.append(wordmark);
}

/**
 * Builds the brand (logo) area from the first fragment section.
 * @param {Element} section Fragment section holding the brand link
 * @returns {Element} The nav-brand element
 */
function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const link = section ? section.querySelector('a') : null;
  const brandLink = link || document.createElement('a');
  if (!brandLink.getAttribute('href')) brandLink.setAttribute('href', '/');
  brandLink.className = '';
  brandLink.setAttribute('aria-label', brandLink.title || 'FedEx home');

  const img = brandLink.querySelector('img');
  const src = img ? img.getAttribute('src') : null;
  if (!img || !src || src === 'about:error') {
    swapToWordmark(brandLink);
  } else {
    img.addEventListener('error', () => swapToWordmark(brandLink));
    if (img.complete && img.naturalWidth === 0) swapToWordmark(brandLink);
  }

  brand.append(brandLink);
  return brand;
}

/**
 * Builds the main menu (drawer on mobile, horizontal bar on desktop)
 * from the authored list in the second fragment section.
 * @param {Element} section Fragment section holding the nav list
 * @returns {Element} The nav-menu element
 */
function buildMenu(section) {
  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  menu.id = 'nav-menu';
  const list = document.createElement('ul');
  list.className = 'nav-list';
  menu.append(list);

  const sourceItems = section ? [...section.querySelectorAll(':scope div > ul > li')] : [];
  sourceItems.filter((li) => li.parentElement.closest('li') === null).forEach((li, i) => {
    const item = document.createElement('li');
    item.className = 'nav-item';
    const sub = li.querySelector(':scope > ul');
    // the label may be wrapped in a p, be a direct link, or be a bare text
    // node before the nested list — never read it from the submenu
    const labelHolder = li.querySelector(':scope > p, :scope > a');
    const labelLink = labelHolder && !labelHolder.matches('a')
      ? labelHolder.querySelector('a')
      : labelHolder;
    const directText = [...li.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join(' ')
      .trim();
    const label = labelHolder ? labelHolder.textContent.trim() : directText;

    if (sub) {
      // dropdown item: button trigger + submenu panel
      item.classList.add('nav-item-drop');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-link';
      btn.textContent = label;
      const subId = `nav-submenu-${i}`;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', subId);

      const submenu = document.createElement('ul');
      submenu.className = 'nav-submenu';
      submenu.id = subId;
      submenu.setAttribute('aria-label', label);
      [...sub.children].forEach((subLi) => {
        const subItem = document.createElement('li');
        const a = subLi.querySelector('a');
        if (a) {
          a.className = '';
          // authors mark the "ALL ... SERVICES" style link with bold text
          if (subLi.querySelector('strong')) a.classList.add('nav-cta');
          subItem.append(a);
        } else {
          subItem.textContent = subLi.textContent.trim();
        }
        submenu.append(subItem);
      });
      item.append(btn, submenu);
    } else if (labelLink) {
      // plain link item (e.g. Locations)
      labelLink.className = 'nav-link';
      item.append(labelLink);
    } else {
      const span = document.createElement('span');
      span.className = 'nav-link';
      span.textContent = label;
      item.append(span);
    }
    list.append(item);
  });

  return menu;
}

/**
 * Builds the utility tools (Sign In, Search) from the third fragment section.
 * @param {Element} section Fragment section holding the tool links
 * @returns {Element} The nav-tools element
 */
function buildTools(section) {
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (!section) return tools;

  section.querySelectorAll('p').forEach((p) => {
    const a = p.querySelector('a');
    if (!a) return;
    a.className = '';
    const icon = p.querySelector('.icon');
    if (icon) {
      // icon-only utility (e.g. Search): move icon into the link, keep text for AT
      a.setAttribute('aria-label', a.textContent.trim() || 'Search');
      a.textContent = '';
      a.append(icon);
      a.classList.add('nav-tool', 'nav-search');
    } else if (/sign\s?(in|up)|log\s?in/i.test(a.textContent)) {
      a.classList.add('nav-tool', 'nav-signin');
    } else {
      a.classList.add('nav-tool');
    }
    tools.append(a);
  });

  return tools;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/fragments/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment ? [...fragment.querySelectorAll(':scope .section')] : [];
  const [brandSection, menuSection, toolsSection] = sections;

  block.textContent = '';

  // accessibility: skip-to-content link
  const skip = document.createElement('a');
  skip.className = 'skip-to-content';
  skip.href = '#main-content';
  skip.textContent = 'Skip to main content';
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main-content';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  const menu = buildMenu(menuSection);
  const tools = buildTools(toolsSection);

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav-menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => toggleDrawer(nav));

  nav.append(buildBrand(brandSection), menu, tools, hamburger);

  // dropdown behavior: click toggles (all devices), hover opens (desktop mouse)
  menu.querySelectorAll('.nav-item-drop').forEach((item) => {
    const btn = item.querySelector('.nav-link');
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      closeDropdowns(nav, btn);
      btn.setAttribute('aria-expanded', String(!expanded));
    });
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !isDesktop.matches) return;
      closeDropdowns(nav, btn);
      btn.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse' || !isDesktop.matches) return;
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // collapse on escape: dropdowns first, then the drawer
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const open = nav.querySelector('.nav-item-drop > .nav-link[aria-expanded="true"]');
    if (open) {
      closeDropdowns(nav);
      open.focus();
    } else if (nav.classList.contains('nav-open')) {
      toggleDrawer(nav, false);
      hamburger.focus();
    }
  });

  // collapse when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (nav.contains(e.target)) return;
    closeDropdowns(nav);
    if (nav.classList.contains('nav-open')) toggleDrawer(nav, false);
  });

  // collapse dropdowns when keyboard focus leaves the nav (desktop)
  nav.addEventListener('focusout', (e) => {
    if (isDesktop.matches && !nav.contains(e.relatedTarget)) closeDropdowns(nav);
  });

  // reset state when crossing the breakpoint
  isDesktop.addEventListener('change', () => toggleDrawer(nav, false));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(skip, navWrapper);
}
