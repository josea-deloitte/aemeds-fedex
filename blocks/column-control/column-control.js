/**
 * Applies one column-control instance's own row/cell config: an optional
 * 3rd cell sets the row's background color, and a col-sm-N block variant
 * sets the width ratio.
 * @param {Element} block A column-control block element
 */
function decorateOne(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  if (cells.length > 2) {
    const bgCell = cells.pop();
    const bg = bgCell.textContent.trim();
    if (bg) {
      block.style.setProperty('--column-control-bg', bg);
      block.classList.add('has-background');
    }
    bgCell.remove();
  }

  const ratioVariant = [...block.classList]
    .map((c) => /^col-sm-(\d{1,2})$/.exec(c))
    .find(Boolean);
  if (ratioVariant) {
    const ratio = Math.min(11, Math.max(1, Number(ratioVariant[1])));
    block.style.setProperty('--column-control-ratio', String(ratio));
  }
}

/**
 * Decorates the column-control block.
 * Matches FedEx's column_control_v1: one row of 2 columns per block
 * instance, with an optional 3rd cell setting that row's background color.
 * Width ratio (col-sm-N), mobile stacking order (fxg-col-mobile_position2),
 * and mobile visibility (hide-mobile) are all set via block-name variants —
 * nest another column-control table inside a cell to reproduce FedEx's
 * recursive column layouts (e.g. a heading row containing pair rows).
 *
 * aem.js's decorateBlocks() only auto-decorates elements exactly two levels
 * under a section, so a nested column-control (authored inside a cell) is
 * never reached by the normal pipeline — this block decorates its own
 * nested instances directly instead of relying on that.
 * @param {Element} block The column-control block element
 */
export default function decorate(block) {
  decorateOne(block);
  block.querySelectorAll(':scope .column-control').forEach((nested) => {
    nested.classList.add('block');
    nested.dataset.blockStatus = 'loaded';
    decorateOne(nested);
  });
}
