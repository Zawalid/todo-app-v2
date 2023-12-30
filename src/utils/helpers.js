export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints ||
    window.matchMedia('(pointer: coarse)').matches
  );
}
