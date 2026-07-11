import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Wraps each footer link column in a mobile-friendly accordion.
 * On desktop the toggle is hidden via CSS and all content stays visible.
 * @param {Element} footer
 */
function decorateFooterAccordion(footer) {
  // Target each cell inside the Columns block (first content section)
  footer.querySelectorAll('.footer .section:first-of-type .columns > div > div').forEach((col) => {
    const heading = col.querySelector('h2, h3');
    if (!heading || isDesktop.matches) return;

    const toggle = document.createElement('button');
    toggle.className = 'footer-col-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = heading.textContent;

    const body = document.createElement('div');
    body.className = 'footer-col-body';
    // move everything except the heading into the body
    [...col.children].forEach((child) => {
      if (child !== heading) body.append(child);
    });

    heading.replaceWith(toggle);
    col.append(body);

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('is-open', !expanded);
    });
  });

  // Restore static layout if viewport grows to desktop
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      footer.querySelectorAll('.footer-col-body').forEach((body) => {
        body.classList.add('is-open');
      });
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/fragments/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  decorateFooterAccordion(footer);

  block.append(footer);
}
