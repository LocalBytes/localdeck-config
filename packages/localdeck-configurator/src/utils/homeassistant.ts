export function notifyHARouteChange(prefix: string, path: string): void {
  if (window.parent === window) return;
  if (!prefix) return;

  window.parent.postMessage({
    type: 'home-assistant/navigate',
    path: prefix.replace(/\/$/, '') + path,
    options: { replace: true },
  }, '*');
}
