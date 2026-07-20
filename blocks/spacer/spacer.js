/**
 * Decorates the spacer block.
 * The single authored value (or comma-separated mobile, tablet, desktop
 * triple) is stored as CSS custom properties; spacer.css picks the right
 * one per breakpoint.
 * @param {Element} block The spacer block element
 */
export default function decorate(block) {
  const [mobile, tablet, desktop] = block.textContent
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (mobile) block.style.setProperty('--spacer-height-mobile', mobile);
  if (tablet) block.style.setProperty('--spacer-height-tablet', tablet);
  if (desktop) block.style.setProperty('--spacer-height-desktop', desktop);

  block.setAttribute('aria-hidden', 'true');
  block.replaceChildren();
}
