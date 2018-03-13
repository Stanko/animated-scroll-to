// Type definitions for AnimateScrollTo 1.0.1
// Project: https://github.com/Stanko/animated-scroll-to
// Definitions by: Stanko <https://github.com/Stanko/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface AnimateScrollToOptions {
  /** duration of the scroll per 1000px. Default 500. */
  speed?: number;
  /** minimum duration of the scroll. Default 250.  */
  minDuration?: number;
  /** maximum duration of the scroll. Default 1500. */
  maxDuration?: number;
  /** DOM element to scroll, defaults to `window`. */
  element?: HTMLElement | Window;
  /**
   * should animated scroll be canceled on user scroll/keypress
   * if set to "false" user input will be disabled until animated scroll is complete.
   * Defaults to `true`.
   */
  cancelOnUserAction?: boolean;
  /** function that will be executed when the scroll animation is finished */
  onComplete?(): void;
}

declare function animateScrollTo(desiredOffset: number | HTMLElement, options?: AnimateScrollToOptions): void;
export default animateScrollTo;
