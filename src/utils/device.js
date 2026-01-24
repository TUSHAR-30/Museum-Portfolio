export function isMobileDevice() {
    return window.matchMedia('(max-width: 768px)').matches;
  }
  