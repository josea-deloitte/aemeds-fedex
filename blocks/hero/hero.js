/**
 * Decorates the hero block.
 * Splits authored content into a media layer and a content layer that
 * are stacked in a single grid cell (no absolute positioning).
 * Expects a two-row table: row 1 = LCP image, row 2 = headline and CTAs.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-content';
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    content.append(...cell.childNodes);
  });

  const media = document.createElement('div');
  media.className = 'hero-media';
  const picture = content.querySelector('picture');
  const img = picture?.querySelector('img') || content.querySelector(':scope > img, :scope > p > img');
  if (picture || img) {
    block.classList.add('hero-has-media');
    if (picture) {
      const holder = picture.closest('p');
      media.append(picture);
      if (holder) holder.remove();
    } else {
      media.append(img);
      img.closest('p')?.remove();
    }

    // LCP candidate: must not be lazy-loaded, regardless of pipeline defaults
    const lcpImg = picture?.querySelector('img') || img;
    if (lcpImg) {
      lcpImg.loading = 'eager';
      lcpImg.setAttribute('fetchpriority', 'high');
      lcpImg.decoding = 'async';
    }
  }

  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.children.length) p.remove();
  });

  block.replaceChildren(media, content);
}
