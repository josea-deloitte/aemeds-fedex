import { decorateIcons } from '../../scripts/aem.js';

// Map link-text keywords → icon names (icons/ folder)
const QUICK_ICON_MAP = {
  quote: 'hero-quote',
  rate: 'hero-quote',
  ship: 'hero-ship',
  location: 'hero-location',
  contact: 'hero-support',
  support: 'hero-support',
};

function isVideoSrc(src) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
}

/** Creates an auto-playing, muted <video> element (plays once, matching fedex.com). */
function createVideo(src, isMobile) {
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('crossorigin', 'anonymous');
  video.className = isMobile
    ? 'hero-homepage-video-mobile'
    : 'hero-homepage-video-desktop';
  const source = document.createElement('source');
  source.src = src;
  source.type = `video/${src.split('.').pop().split('?')[0]}`;
  video.append(source);
  return video;
}

/* SVG strings used for play/pause and mute/unmute controls */
const SVG = {
  pause: `<svg class="hero-svg hero-svg-pause" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="10" y="8" width="4" height="16" fill="white"/>
    <rect x="18" y="8" width="4" height="16" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 16C2 8.27 8.27 2 16 2s14 6.27 14 14-6.27 14-14 14S2 23.73 2 16zm14-12C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z" fill="white"/>
  </svg>`,
  play: `<svg class="hero-svg hero-svg-play" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M13 22V10l10 6-10 6z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 16C2 8.27 8.27 2 16 2s14 6.27 14 14-6.27 14-14 14S2 23.73 2 16zm14-12C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z" fill="white"/>
  </svg>`,
  muted: `<svg class="hero-svg hero-svg-muted" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15 6a1 1 0 0 0-1.6-.8L5.67 11H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.67L13.4 26.8A1 1 0 0 0 15 26V6zM6.6 12.8 13 8v16l-6.4-4.8A1 1 0 0 0 6 19H4v-6h2a1 1 0 0 0 .6-.2z" fill="white"/>
    <path d="M19 12l8 8M27 12l-8 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  unmuted: `<svg class="hero-svg hero-svg-unmuted" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15 6a1 1 0 0 0-1.6-.8L5.67 11H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.67L13.4 26.8A1 1 0 0 0 15 26V6zM6.6 12.8 13 8v16l-6.4-4.8A1 1 0 0 0 6 19H4v-6h2a1 1 0 0 0 .6-.2z" fill="white"/>
    <path d="M20 13.5c1.5 1.5 1.5 3.5 0 5M23 11c3 3 3 7 0 10" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
};

/** Builds play/pause and mute/unmute control buttons for the given video elements. */
function createVideoControls(videos) {
  const wrap = document.createElement('div');
  wrap.className = 'hero-homepage-controls';

  // Play / Pause
  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'hero-homepage-ctrl';
  playBtn.setAttribute('aria-label', 'Pause video');
  playBtn.innerHTML = SVG.pause + SVG.play;
  playBtn.querySelector('.hero-svg-play').hidden = true;

  playBtn.addEventListener('click', () => {
    const paused = videos[0]?.paused;
    videos.forEach((v) => { if (paused) v.play(); else v.pause(); });
    playBtn.setAttribute('aria-label', paused ? 'Pause video' : 'Play video');
    playBtn.querySelector('.hero-svg-pause').hidden = paused;
    playBtn.querySelector('.hero-svg-play').hidden = !paused;
  });

  // Mute / Unmute
  const muteBtn = document.createElement('button');
  muteBtn.type = 'button';
  muteBtn.className = 'hero-homepage-ctrl';
  muteBtn.setAttribute('aria-label', 'Unmute video');
  muteBtn.innerHTML = SVG.muted + SVG.unmuted;
  muteBtn.querySelector('.hero-svg-unmuted').hidden = true;

  muteBtn.addEventListener('click', () => {
    const nowMuted = !videos[0]?.muted;
    videos.forEach((v) => { v.muted = nowMuted; });
    muteBtn.setAttribute('aria-label', nowMuted ? 'Unmute video' : 'Mute video');
    muteBtn.querySelector('.hero-svg-muted').hidden = !nowMuted;
    muteBtn.querySelector('.hero-svg-unmuted').hidden = nowMuted;
  });

  wrap.append(playBtn, muteBtn);
  return wrap;
}

/**
 * Builds the quick-action strip from the cells in the quick-links row.
 * Each cell should contain one <a> link. A cell with the text "track" triggers
 * the tracking form on the right side of the strip.
 */
function buildQuickActions(linkCells, hasTrack) {
  const strip = document.createElement('div');
  strip.className = 'hero-homepage-actions';

  const linksWrap = document.createElement('div');
  linksWrap.className = 'hero-homepage-quick-links';

  linkCells.forEach((cell) => {
    const a = cell.querySelector('a');
    if (!a) return;
    const text = a.textContent.trim();
    const key = Object.keys(QUICK_ICON_MAP).find((k) => text.toLowerCase().includes(k));

    const link = document.createElement('a');
    link.href = a.href;
    link.className = 'hero-homepage-quick-link';

    if (key) {
      const span = document.createElement('span');
      span.className = `icon icon-${QUICK_ICON_MAP[key]}`;
      link.append(span);
    }

    const label = document.createElement('span');
    label.textContent = text;
    link.append(label);
    linksWrap.append(link);
  });

  strip.append(linksWrap);

  if (hasTrack) {
    const form = document.createElement('form');
    form.className = 'hero-homepage-track';
    form.action = '/en-us/tracking.html';
    form.method = 'GET';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'tracknum';
    input.placeholder = 'Tracking number';
    input.setAttribute('aria-label', 'Tracking number');

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'hero-homepage-track-btn';
    btn.textContent = 'TRACK';

    form.append(input, btn);
    strip.append(form);
  }

  return strip;
}

/**
 * Loads and decorates the hero-homepage block.
 *
 * Expected authored row structure (in da.live / Google Doc table):
 *   Row 1  – Background media  : cell 1 = link to desktop .mp4 OR image
 *                                cell 2 = link to mobile .mp4 OR image (optional)
 *   Row 2  – Hero heading      : cell 1 = H1/H2 heading
 *                                cell 2 = product/overlay image (optional)
 *   Row 3  – Body copy         : cell 1 = paragraph (optional)
 *   Row 4  – CTA               : cell 1 = link styled as a button (optional)
 *   Row 5  – Quick links       : one link per cell (3–5 cells);
 *                                add a cell with the word "track" to include
 *                                the tracking-number form on the right side.
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  let desktopSrc = null;
  let mobileSrc = null;
  let bgImage = null;
  let headingEl = null;
  let productImg = null;
  let bodyEl = null;
  let ctaHref = null;
  let ctaText = null;
  const quickLinkCells = [];
  let hasTrack = false;

  rows.forEach((row) => {
    const cells = [...row.children];

    // ── Media row ──────────────────────────────────────────────────────────────
    // Matches when: no media found yet AND first cell contains a video link or
    // an image without a heading sibling.
    if (!desktopSrc && !bgImage) {
      const link = cells[0]?.querySelector('a');
      const img = cells[0]?.querySelector('img');
      if (link && isVideoSrc(link.href)) {
        desktopSrc = link.href;
        const mLink = cells[1]?.querySelector('a');
        if (mLink && isVideoSrc(mLink.href)) mobileSrc = mLink.href;
        return;
      }
      if (img && !cells[0].querySelector('h1, h2')) {
        bgImage = img;
        const mImg = cells[1]?.querySelector('img');
        if (mImg) bgImage.mobileEl = mImg;
        return;
      }
    }

    // ── Quick-links row ────────────────────────────────────────────────────────
    // Matches when: 3 or more cells, each expected to hold one link.
    if (cells.length >= 3) {
      cells.forEach((cell) => {
        if (/^track$/i.test(cell.textContent.trim())) {
          hasTrack = true;
        } else {
          quickLinkCells.push(cell);
        }
      });
      return;
    }

    // ── Heading row ────────────────────────────────────────────────────────────
    const heading = row.querySelector('h1, h2');
    if (heading && !headingEl) {
      if (heading.tagName === 'H1') {
        headingEl = heading;
      } else {
        const h1 = document.createElement('h1');
        h1.innerHTML = heading.innerHTML;
        headingEl = h1;
      }
      const pImg = cells[1]?.querySelector('img');
      if (pImg) productImg = pImg;
      return;
    }

    // ── CTA row ────────────────────────────────────────────────────────────────
    // Single-cell row whose only meaningful content is a link.
    const a = cells[0]?.querySelector('a');
    if (a && !ctaHref && cells.length === 1) {
      ctaHref = a.href;
      ctaText = a.textContent.trim();
      return;
    }

    // ── Body-copy row ──────────────────────────────────────────────────────────
    if (!bodyEl && cells[0]?.textContent.trim()) {
      bodyEl = cells[0].querySelector('p') || (() => {
        const p = document.createElement('p');
        p.textContent = cells[0].textContent.trim();
        return p;
      })();
    }
  });

  // ── Build DOM ──────────────────────────────────────────────────────────────

  // 1. Media layer (full-bleed video or image)
  const media = document.createElement('div');
  media.className = 'hero-homepage-media';

  const videoEls = [];
  if (desktopSrc) {
    const vd = createVideo(desktopSrc, false);
    videoEls.push(vd);
    media.append(vd);
  }
  if (mobileSrc) {
    const vm = createVideo(mobileSrc, true);
    videoEls.push(vm);
    media.append(vm);
  }
  if (bgImage) {
    bgImage.alt = bgImage.alt || '';
    bgImage.className = 'hero-homepage-bg-image';
    bgImage.loading = 'eager';
    media.append(bgImage);
  }

  // 2. Content overlay (text on the left, product image on the right)
  const content = document.createElement('div');
  content.className = 'hero-homepage-content';

  const textCol = document.createElement('div');
  textCol.className = 'hero-homepage-text';

  if (headingEl) textCol.append(headingEl);
  if (bodyEl) textCol.append(bodyEl);

  if (ctaHref) {
    const cta = document.createElement('a');
    cta.href = ctaHref;
    cta.className = 'hero-homepage-cta';
    cta.textContent = ctaText;
    textCol.append(cta);
  }

  content.append(textCol);

  if (productImg) {
    const productCol = document.createElement('div');
    productCol.className = 'hero-homepage-product';
    productImg.loading = 'eager';
    productImg.alt = productImg.alt || 'FedEx product screenshot';
    productCol.append(productImg);
    content.append(productCol);
  }

  media.append(content);

  // 3. Video controls (bottom-right corner of the media area)
  if (videoEls.length) {
    media.append(createVideoControls(videoEls));
  }

  block.append(media);

  // 4. Quick-action strip (overlaps the bottom of the media area)
  if (quickLinkCells.length || hasTrack) {
    block.append(buildQuickActions(quickLinkCells, hasTrack));
  }

  decorateIcons(block);
}
