/**
 * Decorates the CTA banner block.
 * Flattens the single authored cell into a centered content wrapper.
 * @param {Element} block The cta-banner block element
 */
export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'cta-banner-content';
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    content.append(...cell.childNodes);
  });
  block.replaceChildren(content);
}
