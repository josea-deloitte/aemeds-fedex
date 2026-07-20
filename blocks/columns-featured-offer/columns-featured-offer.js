/**
 * Decorates the columns-featured-offer block.
 * Expects a single authored row with two cells: an image and a content
 * cell (heading, body copy, and a link). The image cell is tagged so CSS
 * can lay it out beside the content on wide screens.
 * @param {Element} block The columns-featured-offer block element
 */
export default function decorate(block) {
  const cells = [...(block.firstElementChild ? block.firstElementChild.children : [])];
  const imageCell = cells.find((cell) => cell.querySelector('picture'));
  const contentCell = cells.find((cell) => cell !== imageCell);

  if (imageCell) imageCell.classList.add('columns-featured-offer-image');
  if (contentCell) contentCell.classList.add('columns-featured-offer-content');
}
