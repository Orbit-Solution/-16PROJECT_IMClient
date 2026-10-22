export function currentRoute() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return { path, segments: path.split('/').filter(Boolean) };
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function linkHandler(event) {
  const link = event.target.closest('a[data-route]');
  if (!link) return;
  event.preventDefault();
  navigate(link.getAttribute('href'));
}
