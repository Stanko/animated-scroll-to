export type TCoords = [number | null | undefined, number | null | undefined];

export interface IOptions {
  cancelOnUserAction?: boolean
  easing?: (t: number) => number
  elementToScroll?: Element | Window
  horizontalOffset?: number
  maxDuration?: number
  minDuration?: number
  passive?: boolean
  speed?: number
  verticalOffset?: number
}

// --------- HELPERS

function getElementOffset(el) {
  let top = 0;
  let left = 0;
  let element = el;

  // Loop through the DOM tree
  // and add it's parent's offset to get page offset
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top,
    left,
  };
}

// --------- SCROLL INTERFACES

// ScrollDomElement and ScrollWindow have identical interfaces

class ScrollDomElement {
  element: Element

  constructor(element: Element) {
    this.element = element;
  }

  getHorizontalScroll(): number {
    return this.element.scrollLeft;
  }

  getVerticalScroll(): number {
    return this.element.scrollTop;
  }

  getMaxHorizontalScroll(): number {
    return this.element.scrollWidth - this.element.clientWidth;
  }

  getMaxVerticalScroll(): number {
    return this.element.scrollHeight - this.element.clientHeight;
  }

  getHorizontalElementScrollOffset(elementToScrollTo: Element, elementToScroll: Element): number {
    return getElementOffset(elementToScrollTo).left - getElementOffset(elementToScroll).left;
  }

  getVerticalElementScrollOffset(elementToScrollTo: Element, elementToScroll: Element): number {
    return getElementOffset(elementToScrollTo).top - getElementOffset(elementToScroll).top;
  }

  scrollTo(x: number, y: number) {
    this.element.scrollLeft = x;
    this.element.scrollTop = y;
  }
}

class ScrollWindow {
  getHorizontalScroll(): number {
    return window.scrollX || document.documentElement.scrollLeft;
  }

  getVerticalScroll(): number {
    return window.scrollY || document.documentElement.scrollTop;
  }

  getMaxHorizontalScroll(): number {
    return Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
    ) - window.innerWidth;
  }

  getMaxVerticalScroll(): number {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    ) - window.innerHeight;
  }

  getHorizontalElementScrollOffset(elementToScrollTo: Element): number {
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    return scrollLeft + elementToScrollTo.getBoundingClientRect().left;
  }

  getVerticalElementScrollOffset(elementToScrollTo: Element): number {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return scrollTop + elementToScrollTo.getBoundingClientRect().top;
  }

  scrollTo(x: number, y: number) {
    window.scrollTo(x, y)
  }
}

// --------- KEEPING TRACK OF ACTIVE ANIMATIONS

const activeAnimations = {
  elements: [],
  cancelMethods: [],

  add: (element: Element | Window, cancelAnimation: () => void) => {
    activeAnimations.elements.push(element);
    activeAnimations.cancelMethods.push(cancelAnimation);
  },
  remove: (element: Element | Window, shouldStop: boolean = true) => {
    const index = activeAnimations.elements.indexOf(element);

    if (index > -1) {
      // Stop animation
      if (shouldStop) {
        activeAnimations.cancelMethods[index]();
      }
      // Remove it
      activeAnimations.elements.splice(index, 1);
      activeAnimations.cancelMethods.splice(index, 1);
    }
  }
};

// --------- CHECK IF CODE IS RUNNING IN A BROWSER

const WINDOW_EXISTS = typeof window !== 'undefined';

// --------- ANIMATE SCROLL TO

const defaultOptions: IOptions = {
  cancelOnUserAction: true,
  easing: t => (--t) * t * t + 1, // easeOutCubic
  elementToScroll: WINDOW_EXISTS ? window : null, // Check for server side rendering
  horizontalOffset: 0,
  maxDuration: 3000,
  minDuration: 250,
  speed: 500,
  verticalOffset: 0,
};

async function animateScrollTo(y: number, userOptions?: IOptions): Promise<boolean>;
async function animateScrollTo(coords: TCoords, userOptions?: IOptions): Promise<boolean>;
async function animateScrollTo(scrollToElement: Element, userOptions?: IOptions): Promise<boolean>;
async function animateScrollTo(
  numberOrCoordsOrElement: number | TCoords | Element,
  userOptions: IOptions = {}
): Promise<boolean> {
  // Check for server rendering
  if (!WINDOW_EXISTS) {
    // @ts-ignore
    // If it still gets called on server, return Promise for API consistency
    return new Promise((resolve: (hasScrolledToPosition: boolean) => void) => {
      resolve(false); // Returning false on server
    });
  } else if (!(window as any).Promise) {
    throw (
      'Browser doesn\'t support Promises, and animated-scroll-to depends on it, please provide a polyfill.'
    );
  }

  let x: number | null;
  let y: number | null;
  let scrollToElement: Element;
  let options: IOptions = {
    ...defaultOptions,
    ...userOptions,
  };

  const isWindow = options.elementToScroll === window;
  const isElement = !!(options.elementToScroll as Element).nodeName;

  if (!isWindow && !isElement) {
    throw (
      'Element to scroll needs to be either window or DOM element.'
    );
  }

  // Check for "scroll-behavior: smooth" as it can break the animation
  // https://github.com/Stanko/animated-scroll-to/issues/55
  const scrollBehaviorElement: Element = isWindow ? document.documentElement : (options.elementToScroll as Element);
  const scrollBehavior = getComputedStyle(scrollBehaviorElement).getPropertyValue('scroll-behavior');

  if (scrollBehavior === 'smooth') {
    console.warn(`${scrollBehaviorElement.tagName} has "scroll-behavior: smooth" which can mess up with animated-scroll-to's animations`);
  }

  // Select the correct scrolling interface
  const elementToScroll = isWindow ?
    new ScrollWindow() :
    new ScrollDomElement(options.elementToScroll as Element);

  if (numberOrCoordsOrElement instanceof Element) {
    scrollToElement = numberOrCoordsOrElement;

    // If "elementToScroll" is not a parent of "scrollToElement"
    if (
      isElement &&
      (
        !(options.elementToScroll as Element).contains(scrollToElement) ||
        (options.elementToScroll as Element).isSameNode(scrollToElement)
      )
    ) {
      throw (
        'options.elementToScroll has to be a parent of scrollToElement'
      );
    }

    x = elementToScroll.getHorizontalElementScrollOffset(scrollToElement, (options.elementToScroll as Element));
    y = elementToScroll.getVerticalElementScrollOffset(scrollToElement, (options.elementToScroll as Element));
  } else if (typeof numberOrCoordsOrElement === 'number') {
    x = elementToScroll.getHorizontalScroll();
    y = numberOrCoordsOrElement;
  } else if (Array.isArray(numberOrCoordsOrElement) && numberOrCoordsOrElement.length === 2) {
    x = numberOrCoordsOrElement[0] === null ? elementToScroll.getHorizontalScroll() : numberOrCoordsOrElement[0];
    y = numberOrCoordsOrElement[1] === null ? elementToScroll.getVerticalScroll() : numberOrCoordsOrElement[1];
  } else {
    // ERROR
    throw (
      'Wrong function signature. Check documentation.\n' +
      'Available method signatures are:\n' +
      '  animateScrollTo(y:number, options)\n' +
      '  animateScrollTo([x:number | null, y:number | null], options)\n' +
      '  animateScrollTo(scrollToElement:Element, options)'
    );
  }

  // Add offsets
  x += options.horizontalOffset;
  y += options.verticalOffset;


  // Horizontal scroll distance
  const maxHorizontalScroll = elementToScroll.getMaxHorizontalScroll();
  const initialHorizontalScroll = elementToScroll.getHorizontalScroll();

  // If user specified scroll position is greater than maximum available scroll
  if (x > maxHorizontalScroll) {
    x = maxHorizontalScroll;
  }

  // Calculate distance to scroll
  const horizontalDistanceToScroll = x - initialHorizontalScroll;

  // Vertical scroll distance distance
  const maxVerticalScroll = elementToScroll.getMaxVerticalScroll();
  const initialVerticalScroll = elementToScroll.getVerticalScroll();

  // If user specified scroll position is greater than maximum available scroll
  if (y > maxVerticalScroll) {
    y = maxVerticalScroll;
  }

  // Calculate distance to scroll
  const verticalDistanceToScroll = y - initialVerticalScroll;

  // Calculate duration of the scroll
  const horizontalDuration = Math.abs(Math.round((horizontalDistanceToScroll / 1000) * options.speed));
  const verticalDuration = Math.abs(Math.round((verticalDistanceToScroll / 1000) * options.speed));

  let duration = horizontalDuration > verticalDuration ? horizontalDuration : verticalDuration;

  // Set minimum and maximum duration
  if (duration < options.minDuration) {
    duration = options.minDuration;
  } else if (duration > options.maxDuration) {
    duration = options.maxDuration;
  }

  // @ts-ignore
  return new Promise((resolve: (hasScrolledToPosition: boolean) => void, reject) => {
    // Scroll is already in place, nothing to do
    if (horizontalDistanceToScroll === 0 && verticalDistanceToScroll === 0) {
      // Resolve promise with a boolean hasScrolledToPosition set to true
      resolve(true);
    }

    // Cancel existing animation if it is already running on the same element
    activeAnimations.remove(options.elementToScroll, true);

    // To cancel animation we have to store request animation frame ID 
    let requestID;

    // Cancel animation handler
    const cancelAnimation = () => {
      removeListeners();
      cancelAnimationFrame(requestID);

      // Resolve promise with a boolean hasScrolledToPosition set to false
      resolve(false);
    };

    // Registering animation so it can be canceled if function
    // gets called again on the same element
    activeAnimations.add(options.elementToScroll, cancelAnimation);

    // Prevent user actions handler
    const preventDefaultHandler = e => e.preventDefault();

    const handler = options.cancelOnUserAction ?
      cancelAnimation :
      preventDefaultHandler;

    // If animation is not cancelable by the user, we can't use passive events
    const eventOptions: any = options.cancelOnUserAction ?
      { passive: true } :
      { passive: false };

    const events = [
      'wheel',
      'touchstart',
      'keydown',
      'mousedown',
    ];

    // Function to remove listeners after animation is finished
    const removeListeners = () => {
      events.forEach(eventName => {
        options.elementToScroll.removeEventListener(eventName, handler, eventOptions);
      });
    };

    // Add listeners
    events.forEach(eventName => {
      options.elementToScroll.addEventListener(eventName, handler, eventOptions);
    });

    // Animation
    const startingTime = Date.now();

    const step = () => {
      var timeDiff = Date.now() - startingTime;
      var t = timeDiff / duration;

      const horizontalScrollPosition = Math.round(initialHorizontalScroll + (horizontalDistanceToScroll * options.easing(t)));
      const verticalScrollPosition = Math.round(initialVerticalScroll + (verticalDistanceToScroll * options.easing(t)));

      if (timeDiff < duration && (horizontalScrollPosition !== x || verticalScrollPosition !== y)) {
        // If scroll didn't reach desired position or time is not elapsed
        // Scroll to a new position
        elementToScroll.scrollTo(horizontalScrollPosition, verticalScrollPosition);

        // And request a new step
        requestID = requestAnimationFrame(step);
      } else {
        // If the time elapsed or we reached the desired offset
        // Set scroll to the desired offset (when rounding made it to be off a pixel or two)
        // Clear animation frame to be sure
        elementToScroll.scrollTo(x, y);

        cancelAnimationFrame(requestID);

        // Remove listeners
        removeListeners();

        // Remove animation from the active animations coordinator
        activeAnimations.remove(options.elementToScroll, false);

        // Resolve promise with a boolean hasScrolledToPosition set to true
        resolve(true);
      }
    };

    // Start animating scroll
    requestID = requestAnimationFrame(step);
  });
}

export default animateScrollTo;
