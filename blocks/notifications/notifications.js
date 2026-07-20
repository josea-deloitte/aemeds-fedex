const THEMES = ['success', 'warning', 'error'];

const ICONS = {
  info: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><rect x="11" y="10" width="2" height="7" fill="#fff"/><circle cx="12" cy="7" r="1.2" fill="#fff"/></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7 12.5l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2 1 21h22L12 2z" fill="currentColor"/><rect x="11" y="9" width="2" height="6" fill="#fff"/><circle cx="12" cy="18" r="1.2" fill="#fff"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
};

/**
 * Decorates the notifications block.
 * Wraps the single authored cell in a theme icon + content layout. The
 * theme (info/success/warning/error) comes from a block variant class.
 * @param {Element} block The notifications block element
 */
export default function decorate(block) {
  const theme = THEMES.find((t) => block.classList.contains(t)) || 'info';

  const content = document.createElement('div');
  content.className = 'notifications-content';
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    content.append(...cell.childNodes);
  });

  const icon = document.createElement('div');
  icon.className = 'notifications-icon';
  icon.innerHTML = ICONS[theme];

  block.replaceChildren(icon, content);
  block.setAttribute('role', theme === 'error' ? 'alert' : 'status');
}
