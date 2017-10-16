export const THROTTLE_MS = 500;


// NOTE(lmr): this is a huge hack right now, and prevents anything from being clickable more than
// twice per second, but the alternative is so bad right now. Need to figure out how to fix the
// responder plugin later and fix this.
export function throttle(fn: Function, throttleMs = THROTTLE_MS) {
  let lastCall: number = null;

  return function (...args: any[]) {
    const now = Date.now();
    if (lastCall === null || (now - lastCall > throttleMs)) {
      fn.apply(this, args);
      lastCall = now;
    }
  };
}
