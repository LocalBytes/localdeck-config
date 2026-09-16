export function innerPathFromReferrer(referrer: string, ingressPrefix: string): string | null {
  const url = new URL(referrer);

  if (ingressPrefix && url.pathname.startsWith(ingressPrefix)) {
    return url.pathname.slice(ingressPrefix.length) + url.search;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  return '/' + segments.slice(1).join('/') + url.search;
}
