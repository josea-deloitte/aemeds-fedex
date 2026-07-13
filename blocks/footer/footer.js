import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const desktopMedia = window.matchMedia('(min-width: 900px)');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function convertParagraphLinksToList(scope) {
  scope.querySelectorAll('p').forEach((p) => {
    const links = [...p.querySelectorAll('a')];
    if (!links.length) return;

    const looksLikeList = p.innerHTML.includes('<br>') || p.textContent.trimStart().startsWith('-');
    if (!looksLikeList) return;

    const ul = document.createElement('ul');
    links.forEach((link) => {
      const li = document.createElement('li');
      li.append(link.cloneNode(true));
      ul.append(li);
    });
    p.replaceWith(ul);
  });
}

function ensureCopyrightSymbol(legalSection) {
  const paragraph = legalSection ? legalSection.querySelector('p') : null;
  if (!paragraph) return;
  if (!paragraph.textContent.includes('©')) {
    paragraph.textContent = `© ${paragraph.textContent.trim()}`;
  }
}

function extractSocialSection(root, mainSection, legalSection) {
  const columnsRow = mainSection?.querySelector('.columns > div');
  if (!columnsRow) return;

  const cells = [...columnsRow.children];
  const socialCell = cells.find((cell) => {
    const heading = cell.querySelector('h2, h3');
    return heading && /follow fedex/i.test(heading.textContent);
  });
  if (!socialCell) return;

  const socialSection = document.createElement('div');
  socialSection.className = 'section footer-social';

  const socialWrapper = document.createElement('div');
  socialWrapper.className = 'default-content-wrapper footer-social-inner';
  socialWrapper.append(socialCell);
  socialSection.append(socialWrapper);

  if (legalSection) {
    root.insertBefore(socialSection, legalSection);
  } else {
    root.append(socialSection);
  }
}

function buildAccordions(mainSection) {
  const columns = mainSection?.querySelectorAll('.columns > div > div') || [];

  columns.forEach((column, index) => {
    const heading = column.querySelector('h2, h3');
    if (!heading) return;

    const panel = document.createElement('div');
    panel.className = 'footer-accordion-panel';

    [...column.children].forEach((child) => {
      if (child !== heading) panel.append(child);
    });

    const button = document.createElement('button');
    button.className = 'footer-accordion-toggle';
    button.type = 'button';
    button.textContent = heading.textContent.trim();

    const panelId = `footer-accordion-${slugify(button.textContent)}-${index}`;
    button.setAttribute('aria-controls', panelId);
    panel.id = panelId;

    heading.replaceWith(button);
    column.append(panel);

    button.addEventListener('click', () => {
      if (desktopMedia.matches) return;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.classList.toggle('is-open', !expanded);
    });
  });
}

function syncAccordionState(footerRoot) {
  const buttons = footerRoot.querySelectorAll('.footer-accordion-toggle');

  buttons.forEach((button) => {
    const panel = footerRoot.querySelector(`#${button.getAttribute('aria-controls')}`);
    if (!panel) return;

    if (desktopMedia.matches) {
      button.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
    } else {
      button.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
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
  const footerRoot = document.createElement('div');
  while (fragment.firstElementChild) footerRoot.append(fragment.firstElementChild);

  const mainSection = footerRoot.querySelector('.section:first-of-type');
  const legalSection = footerRoot.querySelector('.section:last-of-type');

  if (mainSection) {
    mainSection.classList.add('footer-main');
    convertParagraphLinksToList(mainSection);
  }

  if (legalSection) {
    legalSection.classList.add('footer-legal');
    ensureCopyrightSymbol(legalSection);
  }

  extractSocialSection(footerRoot, mainSection, legalSection);
  buildAccordions(mainSection);
  syncAccordionState(footerRoot);
  desktopMedia.addEventListener('change', () => syncAccordionState(footerRoot));

  block.append(footerRoot);
}
