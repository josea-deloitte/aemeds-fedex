import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Gap fix: the CMS/da.live Columns block renders footer links as
 * "<p>- <a>Link</a><br>- <a>Link</a></p>" instead of a proper list.
 * This function converts those paragraphs into semantic <ul><li> lists.
 * @param {Element} footer
 */
function cleanFooterLinks(footer) {
  footer.querySelectorAll('.columns > div > div').forEach((col) => {
    col.querySelectorAll('p').forEach((p) => {
      const links = [...p.querySelectorAll('a')];
      if (!links.length) return;
      // Convert if it looks like a dash-separated link paragraph
      if (p.innerHTML.includes('<br>') || p.textContent.trimStart().startsWith('-')) {
        const ul = document.createElement('ul');
        links.forEach((link) => {
          const li = document.createElement('li');
          li.append(link.cloneNode(true));
          ul.append(li);
        });
        p.replaceWith(ul);
      }
    });
  });
}

/**
 * Gap fix: ensure the copyright paragraph has the © symbol.
 * @param {Element} footer
 */
function fixCopyright(footer) {
  const legalSection = footer.querySelector('.section:last-of-type');
  if (!legalSection) return;
  legalSection.querySelectorAll('p').forEach((p) => {
    if (p.textContent.includes('FedEx') && !p.textContent.includes('©')) {
      p.textContent = `© ${p.textContent.trim()}`;
    }
  });
}

/**
 * Gap fix: wrap each footer link column in a mobile accordion.
 * On desktop the toggle is hidden and content stays visible.
 * Selector fixed: the inner div doesn't carry .footer — query from the passed element.
 * @param {Element} footer
 */
function decorateFooterAccordion(footer) {
  // Gap fix: was '.footer .section:first-of-type' — that selector never matched
  // because `footer` here is the plain inner div, not the .footer block element.
  footer.querySelectorAll('.section:first-of-type .columns > div > div').forEach((col) => {
    const heading = col.querySelector('h2, h3');
    if (!heading || isDesktop.matches) return;

    const toggle = document.createElement('button');
    toggle.className = 'footer-col-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = heading.textContent;

    const body = document.createElement('div');
    body.className = 'footer-col-body';
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

  // When viewport grows to desktop, open all accordion bodies
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
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/fragments/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Run all decoration passes before appending to the DOM
  cleanFooterLinks(footer);
  fixCopyright(footer);
  decorateFooterAccordion(footer);

  block.append(footer);
}
