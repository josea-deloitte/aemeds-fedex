const VARIANTS = ['primary', 'secondary', 'accent'];

/**
 * Decorates the button block.
 * The single authored link becomes either a plain colored text link (the
 * default, matching FedEx's most common button_v1 look) or one of the
 * sitewide primary/secondary/accent button styles from styles.css.
 * @param {Element} block The button block element
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;

  const variant = VARIANTS.find((v) => block.classList.contains(v));
  if (variant) {
    link.classList.add('button', variant);
  } else {
    link.classList.add('button-link');
  }
  block.replaceChildren(link);
}
