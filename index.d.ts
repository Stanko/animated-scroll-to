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
   * Additional offset value that gets added to the desiredOffset. This is
   * useful when passing a DOM object as the desiredOffset and wanting to adjust
   * for an fixed nav or to add some padding.
   */
  offset?: number;
  /**
   * should animated scroll be canceled on user scroll/keypress
   * if set to "false" user input will be disabled until animated scroll is complete.
   * Defaults to `true`.
   */
  cancelOnUserAction?: boolean;
  /** function that will be executed when the scroll animation is finished */
  /** Sets passive event listeners **/ 
  passive?: boolean;
  /** scroll horizontally rather than vertically (which is the default) */
  horizontal?: boolean;
  onComplete?(): void;
}

declare function animateScrollTo(desiredOffset: number | HTMLElement, options?: AnimateScrollToOptions): void;
export default animateScrollTo;
