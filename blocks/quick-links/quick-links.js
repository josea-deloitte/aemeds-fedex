/**
 * Decorates the quick links block.
 * Each authored row holds an icon and a link; rows become a list of
 * circular icon chips with the link label underneath.
 * @param {Element} block The quick-links block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const link = row.querySelector('a[href]');
    if (!link) return;

    const a = document.createElement('a');
    a.href = link.href;
    a.title = link.title || link.textContent.trim();

    const icon = row.querySelector('span.icon');
    if (icon) {
      const chip = document.createElement('span');
      chip.className = 'quick-links-chip';
      chip.append(icon);
      a.append(chip);
    }

    const label = document.createElement('span');
    label.className = 'quick-links-label';
    label.textContent = link.textContent.trim();
    a.append(label);

    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
