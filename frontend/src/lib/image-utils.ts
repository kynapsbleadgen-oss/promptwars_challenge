function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

export function unsplashUrl(query: string, w = 1200, h = 1500) {
  // loremflickr proxies Flickr photos by tag — reliable, no API key
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(query)}?lock=${Math.abs(hashString(query))}`;
}
