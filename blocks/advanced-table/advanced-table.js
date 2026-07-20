/**
 * Decorates the advanced-table block.
 * Builds a real <table> from the authored rows: the first row becomes the
 * header (unless the "no-header" variant is set), remaining rows become
 * body rows. Each body cell gets a data-label from its column header so
 * advanced-table.css can stack cells into label/value pairs on mobile.
 * @param {Element} block The advanced-table block element
 */
export default function decorate(block) {
  const noHeader = block.classList.contains('no-header');
  const rows = [...block.children];
  const table = document.createElement('table');

  let headerLabels = [];
  if (!noHeader && rows.length) {
    const headerRow = rows.shift();
    const tr = document.createElement('tr');
    [...headerRow.children].forEach((cell) => {
      const th = document.createElement('th');
      th.append(...cell.childNodes);
      tr.append(th);
    });
    const thead = document.createElement('thead');
    thead.append(tr);
    table.append(thead);
    headerLabels = [...tr.children].map((th) => th.textContent.trim());
  }

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, i) => {
      const td = document.createElement('td');
      if (headerLabels[i]) td.dataset.label = headerLabels[i];
      td.append(...cell.childNodes);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);

  const scroller = document.createElement('div');
  scroller.className = 'advanced-table-scroll';
  scroller.append(table);
  block.replaceChildren(scroller);
}
