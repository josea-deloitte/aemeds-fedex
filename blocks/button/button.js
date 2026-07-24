const GLOBAL_VARIANTS = ['primary', 'secondary', 'accent'];

/**
 * Decorates the button block.
 * The single authored link becomes a plain colored text link (the default,
 * matching FedEx's most common button_v1 look), the block's own orange
 * outline treatment (`outline`, matching the rarer fxg-button--transparent
 * case e.g. "Start shipping now"), or one of the sitewide
 * primary/secondary/accent button styles from styles.css.
 * @param {Element} block The button block element
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;

  const globalVariant = GLOBAL_VARIANTS.find((v) => block.classList.contains(v));
  if (globalVariant) {
    link.classList.add('button', globalVariant);
  } else if (block.classList.contains('outline')) {
    link.classList.add('button-outline');
  } else {
    link.classList.add('button-link');
  }
  block.replaceChildren(link);
}
