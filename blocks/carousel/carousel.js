let carouselInstance = 0;

/**
 * Decorates the carousel block.
 * Each authored row becomes a slide: [image | text content].
 * Slides live in a scroll-snap track; prev/next buttons and dot
 * indicators scroll it, so it degrades to a plain swipeable list.
 * @param {Element} block The carousel block element
 */
export default function decorate(block) {
  carouselInstance += 1;
  const idPrefix = `carousel-${carouselInstance}`;

  const rows = [...block.children];
  const track = document.createElement('div');
  track.className = 'carousel-slides';

  const slides = rows.map((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.id = `${idPrefix}-slide-${i}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${rows.length}`);
    [...row.children].forEach((cell) => {
      cell.className = cell.querySelector('picture') ? 'carousel-slide-image' : 'carousel-slide-content';
      slide.append(cell);
    });
    track.append(slide);
    return slide;
  });
  if (!slides.length) return;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Featured content');

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Next slide');

  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    indicators.append(dot);
  });

  const currentIndex = () => Math.min(
    slides.length - 1,
    Math.max(0, Math.round(track.scrollLeft / track.clientWidth)),
  );

  const scrollToSlide = (i) => {
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  const update = () => {
    const index = currentIndex();
    [...indicators.children].forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  };

  [...indicators.children].forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToSlide(i));
  });
  prev.addEventListener('click', () => scrollToSlide(Math.max(0, currentIndex() - 1)));
  next.addEventListener('click', () => scrollToSlide(Math.min(slides.length - 1, currentIndex() + 1)));

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  });

  // the block is still hidden when decorate runs, so the initial update()
  // sees clientWidth 0; recompute once the track gets laid out or resized
  if (window.ResizeObserver) new ResizeObserver(update).observe(track);

  block.replaceChildren(track);
  if (slides.length > 1) {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.append(prev, indicators, next);
    block.append(controls);
  }
  update();
}
