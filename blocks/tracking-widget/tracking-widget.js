let widgetInstance = 0;

/**
 * Converts the panel's submit link into an accessible GET form.
 * The authored link must end in an empty query parameter, e.g.
 * `https://www.fedex.com/fedextrack/?trknbr=`; that parameter becomes
 * the name of the text input, so the native form submit produces the
 * same URL with the user's value filled in. Other parameters on the
 * link are preserved as hidden fields.
 * @param {Element} panel The tabpanel element
 * @param {string} fieldLabel The authored input label
 * @param {string} idPrefix Unique prefix for element ids
 * @param {string} tabLabel The tab label for form aria-label
 */
function buildForm(panel, fieldLabel, idPrefix, tabLabel) {
  const link = [...panel.querySelectorAll('a[href]')].find(
    (a) => [...new URL(a.href).searchParams.values()].includes(''),
  );
  if (!link) return;

  const url = new URL(link.href);
  const form = document.createElement('form');
  form.method = 'get';
  form.action = url.origin + url.pathname;
  form.setAttribute('aria-label', tabLabel);

  const field = document.createElement('div');
  field.className = 'tracking-widget-field';
  const label = document.createElement('label');
  label.setAttribute('for', `${idPrefix}-input`);
  label.textContent = fieldLabel;
  const input = document.createElement('input');
  input.type = 'search';
  input.id = `${idPrefix}-input`;
  input.name = '';
  input.required = true;
  input.autocomplete = 'off';
  input.placeholder = fieldLabel;
  input.setAttribute('aria-label', fieldLabel);
  field.append(label, input);

  url.searchParams.forEach((value, key) => {
    if (value === '') {
      input.name = key;
    } else {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = key;
      hidden.value = value;
      form.append(hidden);
    }
  });

  const submitLabel = link.textContent.trim() || fieldLabel;
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary';
  submit.textContent = submitLabel;
  submit.setAttribute('aria-label', submitLabel);

  panel.querySelectorAll('p').forEach((p) => {
    if (!p.querySelector('a.button, a[href]') && p.textContent.trim()) {
      p.classList.add('tracking-widget-hint');
    }
  });

  form.append(field, submit);
  const holder = link.closest('p');
  (holder || link).replaceWith(form);
}

/**
 * Returns the index of the tab that should be selected on load.
 * Add block class `default-track` to match fedex.com (Track tab active).
 * @param {HTMLButtonElement[]} tabs Tab buttons
 * @param {Element} block The block element
 * @returns {number}
 */
function getDefaultTabIndex(tabs, block) {
  if (block.classList.contains('default-track')) {
    const trackIndex = tabs.findIndex(
      (tab) => tab.textContent.trim().toLowerCase() === 'track',
    );
    if (trackIndex >= 0) return trackIndex;
  }
  return 0;
}

/**
 * Decorates the tracking widget block.
 * Each authored row becomes a tab: [tab label | input label | content].
 * Rows without an input label render their content as plain CTAs.
 * @param {Element} block The tracking-widget block element
 */
export default function decorate(block) {
  widgetInstance += 1;
  const idPrefix = `tracking-widget-${widgetInstance}`;

  const tablist = document.createElement('div');
  tablist.className = 'tracking-widget-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Shipping and tracking tools');

  const tabs = [];
  const panels = [];

  [...block.children].forEach((row) => {
    const [labelCell, fieldCell, contentCell] = row.children;
    const tabLabel = labelCell ? labelCell.textContent.trim() : '';
    if (!tabLabel || !contentCell) return;
    const i = tabs.length;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `${idPrefix}-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${idPrefix}-panel-${i}`);
    tab.textContent = tabLabel;

    const panel = document.createElement('div');
    panel.className = 'tracking-widget-panel';
    panel.id = `${idPrefix}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.append(...contentCell.childNodes);

    const fieldLabel = fieldCell ? fieldCell.textContent.trim() : '';
    if (fieldLabel) buildForm(panel, fieldLabel, `${idPrefix}-${i}`, tabLabel);

    tabs.push(tab);
    panels.push(panel);
  });

  const select = (index) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
  });

  tablist.addEventListener('keydown', (e) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = current;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  });

  tablist.append(...tabs);
  block.replaceChildren(tablist, ...panels);
  if (tabs.length) select(getDefaultTabIndex(tabs, block));
}
