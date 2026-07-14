function getCells(block) {
  return [...block.children]
    .map((row) => row.querySelector(':scope > div'))
    .filter(Boolean);
}

function getHeroImage(row) {
  if (!row) return null;
  const picture = row.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    return { picture, img };
  }

  const img = row.querySelector('img');
  if (!img) return null;
  return { picture: null, img };
}

function buildContent(row) {
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (!row) return content;

  const heading = row.querySelector('h1, h2, h3');
  if (heading) content.append(heading);

  const subtitle = [...row.querySelectorAll('p')].find((p) => !p.querySelector('a, img, picture'));
  if (subtitle) {
    subtitle.classList.add('hero-subtitle');
    content.append(subtitle);
  }

  const links = [...row.querySelectorAll('a')];
  if (links.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    links.forEach((link) => actions.append(link));
    content.append(actions);
  }

  return content;
}

/**
 * Loads and decorates the hero block.
 * Authoring structure:
 * - Row 1: image
 * - Row 2: heading + subtitle + CTA links
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [imageRow, contentRow] = getCells(block);
  const media = document.createElement('div');
  media.className = 'hero-media';

  const imageData = getHeroImage(imageRow);
  if (imageData) {
    const { picture, img } = imageData;
    if (picture) {
      media.append(picture);
    } else {
      media.append(img);
    }

    if (img) {
      img.loading = 'eager';
      img.decoding = 'async';
      img.setAttribute('fetchpriority', 'high');
    }
  }

  const content = buildContent(contentRow || imageRow);
  block.replaceChildren(media, content);
}
