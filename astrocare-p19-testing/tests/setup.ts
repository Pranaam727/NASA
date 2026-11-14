import '@testing-library/jest-dom';

// Polyfill performance.now in Node/JSDOM environments if missing
if (typeof performance === 'undefined' || !performance.now) {
  (global as any).performance = {
    now: () => Date.now(),
  };
}

// Mock HTMLCanvasElement getContext for axe-core contrast checks in JSDOM
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => null;
}
