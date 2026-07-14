import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const DESKTOP_QUERY = window.matchMedia('(min-width: 900px)');

function closeDropdowns(nav, except = null) {
  nav.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach((trigger) => {
    if (trigger !== except) trigger.setAttribute('aria-expanded', 'false');
  });
}

function toggleDrawer(nav, force = null) {
  const hamburger = nav.querySelector('.nav-hamburger');
  const shouldOpen = force !== null ? force : hamburger.getAttribute('aria-expanded') !== 'true';
  hamburger.setAttribute('aria-expanded', String(shouldOpen));
  hamburger.setAttribute('aria-label', shouldOpen ? 'Close menu' : 'Open menu');
  nav.classList.toggle('nav-open', shouldOpen);
  document.body.style.overflowY = shouldOpen && !DESKTOP_QUERY.matches ? 'hidden' : '';
  if (!shouldOpen) closeDropdowns(nav);
}

function buildBrand(section) {
  const container = document.createElement('div');
  container.className = 'nav-brand';
  const link = section ? section.querySelector('a') : null;
  const brandLink = link || document.createElement('a');
  if (!brandLink.getAttribute('href')) brandLink.setAttribute('href', '/');
  brandLink.className = '';
  brandLink.setAttribute('aria-label', 'FedEx home');
  container.append(brandLink);
  return container;
}

function getTopItemLabel(li) {
  const topLink = li.querySelector(':scope > a, :scope > p > a');
  if (topLink) return { text: topLink.textContent.trim(), link: topLink };
  const paragraph = li.querySelector(':scope > p');
  if (paragraph) return { text: paragraph.textContent.trim(), link: null };
  const text = [...li.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join(' ')
    .trim();
  return { text, link: null };
}

function buildMenu(section) {
  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  menu.id = 'nav-menu';

  const list = document.createElement('ul');
  list.className = 'nav-menu-list';
  menu.append(list);

  const sourceList = section ? section.querySelector('ul') : null;
  const topItems = sourceList ? [...sourceList.children].filter((el) => el.matches('li')) : [];

  topItems.forEach((li, index) => {
    const item = document.createElement('li');
    item.className = 'nav-item';

    const submenuSource = li.querySelector(':scope > ul');
    const { text, link } = getTopItemLabel(li);

    if (submenuSource) {
      item.classList.add('nav-item-drop');
      const trigger = document.createElement('button');
      const submenuId = `nav-submenu-${index}`;
      trigger.type = 'button';
      trigger.className = 'nav-link nav-trigger';
      trigger.textContent = text;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', submenuId);

      const submenu = document.createElement('ul');
      submenu.className = 'nav-submenu';
      submenu.id = submenuId;
      submenu.setAttribute('aria-label', text);

      [...submenuSource.children].filter((el) => el.matches('li')).forEach((subLi) => {
        const subItem = document.createElement('li');
        const subLink = subLi.querySelector('a');
        if (subLink) {
          subLink.className = '';
          if (subLi.querySelector('strong')) subLink.classList.add('nav-cta');
          subItem.append(subLink);
        } else {
          subItem.textContent = subLi.textContent.trim();
        }
        submenu.append(subItem);
      });

      item.append(trigger, submenu);
    } else if (link) {
      link.className = 'nav-link';
      item.append(link);
    } else {
      const textNode = document.createElement('span');
      textNode.className = 'nav-link';
      textNode.textContent = text;
      item.append(textNode);
    }

    list.append(item);
  });

  return menu;
}

function buildUtility(section) {
  const utility = document.createElement('div');
  utility.className = 'nav-utility';
  if (!section) return utility;

  section.querySelectorAll('a').forEach((link) => {
    link.className = '';
    link.classList.add('nav-utility-link');
    const text = link.textContent.trim();
    if (/search/i.test(text)) link.classList.add('is-search');
    if (/sign\s?(in|up)|log\s?in/i.test(text)) link.classList.add('is-auth');
    utility.append(link);
  });

  return utility;
}

/**
 * loads and decorates the header block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/fragments/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment ? [...fragment.querySelectorAll(':scope .section')] : [];
  const [brandSection, menuSection, utilitySection] = sections;

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('aria-label', 'Main');

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav-menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';

  const brand = buildBrand(brandSection);
  const menu = buildMenu(menuSection);
  const utility = buildUtility(utilitySection);

  nav.append(brand, utility, hamburger, menu);
  hamburger.addEventListener('click', () => toggleDrawer(nav));

  menu.querySelectorAll('.nav-item-drop').forEach((item) => {
    const trigger = item.querySelector('.nav-trigger');
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      closeDropdowns(nav, trigger);
      trigger.setAttribute('aria-expanded', String(!expanded));
    });

    item.addEventListener('pointerenter', (event) => {
      if (!DESKTOP_QUERY.matches || event.pointerType !== 'mouse') return;
      closeDropdowns(nav, trigger);
      trigger.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('pointerleave', (event) => {
      if (!DESKTOP_QUERY.matches || event.pointerType !== 'mouse') return;
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.code !== 'Escape') return;
    const openTrigger = nav.querySelector('.nav-trigger[aria-expanded="true"]');
    if (openTrigger) {
      closeDropdowns(nav);
      openTrigger.focus();
      return;
    }
    if (nav.classList.contains('nav-open')) {
      toggleDrawer(nav, false);
      hamburger.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (nav.contains(event.target)) return;
    closeDropdowns(nav);
    if (nav.classList.contains('nav-open')) toggleDrawer(nav, false);
  });

  nav.addEventListener('focusout', (event) => {
    if (DESKTOP_QUERY.matches && !nav.contains(event.relatedTarget)) closeDropdowns(nav);
  });

  DESKTOP_QUERY.addEventListener('change', () => toggleDrawer(nav, false));

  const wrapper = document.createElement('div');
  wrapper.className = 'header-wrapper';
  wrapper.append(nav);
  block.replaceChildren(wrapper);
}
