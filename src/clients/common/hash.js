export function getHashParams(url) {
  return new URLSearchParams(new URL(url).hash.slice(1));
}
