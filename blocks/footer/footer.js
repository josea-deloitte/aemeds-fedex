import { getMetadata, decorateIcons } from '../../scripts/aem.js';
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

/**
 * Transforms the "Language" column into a country link + language dropdown widget.
 * Expects: h2 "Language", a <p> with country link, and a <ul> of language options.
 */
function buildLanguageSelector(mainSection) {
  const columns = mainSection ? [...mainSection.querySelectorAll('.columns > div > div')] : [];
  const langColumn = columns.find((col) => {
    const heading = col.querySelector('h2, h3');
    return heading && /language/i.test(heading.textContent);
  });
  if (!langColumn) return;

  const countryPara = langColumn.querySelector('p');
  const countryLink = countryPara?.querySelector('a');
  const langList = langColumn.querySelector('ul');
  if (!countryLink || !langList) return;

  const selector = document.createElement('div');
  selector.className = 'footer-lang-selector';

  // Country link with globe icon
  const countryA = document.createElement('a');
  countryA.href = countryLink.href;
  countryA.className = 'footer-country-link';
  const globeIcon = document.createElement('span');
  globeIcon.className = 'icon icon-globe';
  countryA.append(globeIcon, document.createTextNode(` ${countryLink.textContent.trim()}`));
  selector.append(countryA);

  // Language dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'footer-lang-dropdown';

  const currentLangLink = langList.querySelector('a[aria-current="true"]') || langList.querySelector('a');
  const currentLangLabel = currentLangLink?.textContent.trim() || 'English';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'footer-lang-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-haspopup', 'listbox');
  toggle.setAttribute('aria-label', 'Select language');
  toggle.textContent = currentLangLabel;
  const chevron = document.createElement('span');
  chevron.className = 'footer-lang-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  toggle.append(chevron);
  dropdown.append(toggle);

  const optionsList = document.createElement('ul');
  optionsList.className = 'footer-lang-options';
  optionsList.setAttribute('role', 'listbox');
  [...langList.querySelectorAll('li')].forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    const optionLi = document.createElement('li');
    optionLi.setAttribute('role', 'option');
    const isSelected = link.getAttribute('aria-current') === 'true'
      || link.textContent.trim() === currentLangLabel;
    if (isSelected) optionLi.setAttribute('aria-selected', 'true');
    optionLi.append(link.cloneNode(true));
    optionsList.append(optionLi);
  });
  dropdown.append(optionsList);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
  document.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
  });

  selector.append(dropdown);
  countryPara.replaceWith(selector);
  langList.remove();
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

/**
 * Replaces social link text with icon spans and adds .footer-social-link class.
 * Icons are loaded via decorateIcons() at the end of decorate().
 */
function decorateSocialLinks(socialSection) {
  const iconMap = {
    newsletter: 'social-email',
    email: 'social-email',
    facebook: 'social-facebook',
    twitter: 'social-x',
    x: 'social-x',
    instagram: 'social-instagram',
    linkedin: 'social-linkedin',
    youtube: 'social-youtube',
    pinterest: 'social-pinterest',
  };
  const ariaLabels = {
    newsletter: 'Newsletter Signup',
    email: 'Newsletter Signup',
    facebook: 'FedEx on Facebook',
    twitter: 'FedEx on Twitter',
    x: 'FedEx on X',
    instagram: 'FedEx on Instagram',
    linkedin: 'FedEx on LinkedIn',
    youtube: 'FedEx on YouTube',
    pinterest: 'FedEx on Pinterest',
  };

  socialSection.querySelectorAll('a').forEach((link) => {
    const linkText = link.textContent.trim().toLowerCase();
    // exact match first (handles standalone "x"), then substring
    const iconKey = Object.keys(iconMap).find((k) => linkText === k)
      || Object.keys(iconMap).find((k) => linkText.includes(k));
    if (!iconKey) return;
    const iconSpan = document.createElement('span');
    iconSpan.className = `icon icon-${iconMap[iconKey]}`;
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', ariaLabels[iconKey] || link.textContent.trim());
    }
    link.textContent = '';
    link.append(iconSpan);
    link.classList.add('footer-social-link');
  });
}

/** Marks accordion panels that contain multiple <ul> children for two-column CSS layout. */
function markTwoColPanels(mainSection) {
  if (!mainSection) return;
  mainSection.querySelectorAll('.footer-accordion-panel').forEach((panel) => {
    if (panel.querySelectorAll(':scope > ul').length > 1) {
      panel.classList.add('footer-two-col');
    }
  });
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
  footerRoot.querySelectorAll('.footer-accordion-toggle').forEach((button) => {
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

  const sections = [...footerRoot.querySelectorAll('.section')];
  const mainSection = sections[0] || null;
  const legalSection = sections.length > 1 ? sections[sections.length - 1] : null;

  if (mainSection) {
    mainSection.classList.add('footer-main');
    convertParagraphLinksToList(mainSection);
    buildLanguageSelector(mainSection);
  }

  if (legalSection) {
    legalSection.classList.add('footer-legal');
    ensureCopyrightSymbol(legalSection);
  }

  extractSocialSection(footerRoot, mainSection, legalSection);
  buildAccordions(mainSection);
  markTwoColPanels(mainSection);
  syncAccordionState(footerRoot);
  desktopMedia.addEventListener('change', () => syncAccordionState(footerRoot));

  const socialSection = footerRoot.querySelector('.footer-social');
  if (socialSection) decorateSocialLinks(socialSection);

  block.append(footerRoot);
  decorateIcons(block);
}
