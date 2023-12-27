export function remove$Properties(updatedTask) {
    for (let prop in updatedTask) {
        if (prop.startsWith('$')) {
            delete updatedTask[prop];
        }
    }
}
export function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }