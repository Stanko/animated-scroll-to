"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// --------- SCROLL INTERFACES
// ScrollDomElement and ScrollWindow have identical interfaces
var ScrollDomElement = /** @class */ (function () {
    function ScrollDomElement(element) {
        this.element = element;
    }
    ScrollDomElement.prototype.getHorizontalScroll = function () {
        return this.element.scrollLeft;
    };
    ScrollDomElement.prototype.getVerticalScroll = function () {
        return this.element.scrollTop;
    };
    ScrollDomElement.prototype.getMaxHorizontalScroll = function () {
        return this.element.scrollWidth - this.element.clientWidth;
    };
    ScrollDomElement.prototype.getMaxVerticalScroll = function () {
        return this.element.scrollHeight - this.element.clientHeight;
    };
    ScrollDomElement.prototype.getHorizontalElementScrollOffset = function (elementToScrollTo) {
        return elementToScrollTo.getBoundingClientRect().left + this.element.scrollLeft - this.element.getBoundingClientRect().left;
    };
    ScrollDomElement.prototype.getVerticalElementScrollOffset = function (elementToScrollTo) {
        return elementToScrollTo.getBoundingClientRect().top + this.element.scrollTop - this.element.getBoundingClientRect().top;
    };
    ScrollDomElement.prototype.scrollTo = function (x, y) {
        this.element.scrollLeft = x;
        this.element.scrollTop = y;
    };
    return ScrollDomElement;
}());
var ScrollWindow = /** @class */ (function () {
    function ScrollWindow() {
    }
    ScrollWindow.prototype.getHorizontalScroll = function () {
        return window.scrollX || document.documentElement.scrollLeft;
    };
    ScrollWindow.prototype.getVerticalScroll = function () {
        return window.scrollY || document.documentElement.scrollTop;
    };
    ScrollWindow.prototype.getMaxHorizontalScroll = function () {
        return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth) - window.innerWidth;
    };
    ScrollWindow.prototype.getMaxVerticalScroll = function () {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - window.innerHeight;
    };
    ScrollWindow.prototype.getHorizontalElementScrollOffset = function (elementToScrollTo) {
        var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        return scrollLeft + elementToScrollTo.getBoundingClientRect().left;
    };
    ScrollWindow.prototype.getVerticalElementScrollOffset = function (elementToScrollTo) {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        return scrollTop + elementToScrollTo.getBoundingClientRect().top;
    };
    ScrollWindow.prototype.scrollTo = function (x, y) {
        window.scrollTo(x, y);
    };
    return ScrollWindow;
}());
// --------- KEEPING TRACK OF ACTIVE ANIMATIONS
var activeAnimations = {
    elements: [],
    cancelMethods: [],
    add: function (element, cancelAnimation) {
        activeAnimations.elements.push(element);
        activeAnimations.cancelMethods.push(cancelAnimation);
    },
    stop: function (element) {
        var index = activeAnimations.elements.indexOf(element);
        if (index > -1) {
            // Stop animation
            activeAnimations.cancelMethods[index]();
            // Remove it
            activeAnimations.elements.splice(index, 1);
            activeAnimations.cancelMethods.splice(index, 1);
        }
    }
};
// --------- ANIMATE SCROLL TO
var defaultOptions = {
    cancelOnUserAction: true,
    easing: function (t) { return (--t) * t * t + 1; },
    elementToScroll: window,
    horizontalOffset: 0,
    maxDuration: 3000,
    minDuration: 250,
    speed: 500,
    verticalOffset: 0,
};
function animateScrollTo(numberOrCoordsOrElement, userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    // Check for server rendering
    if (typeof window === 'undefined') {
        // Silently fail
        return;
    }
    else if (!window.Promise) {
        throw ('Browser doesn\'t support Promises, and animated-scroll-to depends on it, please provide a polyfill.');
    }
    var x;
    var y;
    var scrollToElement;
    var options = __assign(__assign({}, defaultOptions), userOptions);
    var isWindow = options.elementToScroll === window;
    var isElement = !!options.elementToScroll.nodeName;
    if (!isWindow && !isElement) {
        throw ('Element to scroll needs to be either window or DOM element.');
    }
    var elementToScroll = isWindow ?
        new ScrollWindow() :
        new ScrollDomElement(options.elementToScroll);
    if (numberOrCoordsOrElement instanceof Element) {
        scrollToElement = numberOrCoordsOrElement;
        x = elementToScroll.getHorizontalElementScrollOffset(scrollToElement);
        y = elementToScroll.getVerticalElementScrollOffset(scrollToElement);
    }
    else if (typeof numberOrCoordsOrElement === 'number') {
        x = elementToScroll.getHorizontalScroll();
        y = numberOrCoordsOrElement;
    }
    else if (Array.isArray(numberOrCoordsOrElement) && numberOrCoordsOrElement.length === 2) {
        x = numberOrCoordsOrElement[0] === null ? elementToScroll.getHorizontalScroll() : numberOrCoordsOrElement[0];
        y = numberOrCoordsOrElement[1] === null ? elementToScroll.getVerticalScroll() : numberOrCoordsOrElement[1];
    }
    else {
        // ERROR
        throw ('Wrong function signature. Check documentation.\n' +
            'Available method signatures are:\n' +
            '  animateScrollTo(y:number, options)\n' +
            '  animateScrollTo([x:number | null, y:number | null], options)\n' +
            '  animateScrollTo(scrollToElement:Element, options)');
    }
    // Add offsets
    x += options.horizontalOffset;
    y += options.verticalOffset;
    // Horizontal scroll distance
    var maxHorizontalScroll = elementToScroll.getMaxHorizontalScroll();
    var initialHorizontalScroll = elementToScroll.getHorizontalScroll();
    // If user specified scroll position is greater than maximum available scroll
    if (x > maxHorizontalScroll) {
        x = maxHorizontalScroll;
    }
    // Calculate distance to scroll
    var horizontalDistanceToScroll = x - initialHorizontalScroll;
    // Vertical scroll distance distance
    var maxVerticalScroll = elementToScroll.getMaxVerticalScroll();
    var initialVerticalScroll = elementToScroll.getVerticalScroll();
    // If user specified scroll position is greater than maximum available scroll
    if (y > maxVerticalScroll) {
        y = maxVerticalScroll;
    }
    // Calculate distance to scroll
    var verticalDistanceToScroll = y - initialVerticalScroll;
    // Calculate duration of the scroll
    var horizontalDuration = Math.abs(Math.round((horizontalDistanceToScroll / 1000) * options.speed));
    var verticalDuration = Math.abs(Math.round((verticalDistanceToScroll / 1000) * options.speed));
    var duration = horizontalDuration > verticalDuration ? horizontalDuration : verticalDuration;
    // Set minimum and maximum duration
    if (duration < options.minDuration) {
        duration = options.minDuration;
    }
    else if (duration > options.maxDuration) {
        duration = options.maxDuration;
    }
    // @ts-ignore
    return new Promise(function (resolve, reject) {
        // Scroll is already in place, nothing to do
        if (horizontalDistanceToScroll === 0 && verticalDistanceToScroll === 0) {
            // Resolve promise with a boolean hasScrolledToPosition set to true
            resolve(true);
        }
        // Cancel existing animation if it is already running on the same element
        activeAnimations.stop(options.elementToScroll);
        // To cancel animation we have to store request animation frame ID 
        var requestID;
        // Cancel animation handler
        var cancelAnimation = function () {
            removeListeners();
            cancelAnimationFrame(requestID);
            // Resolve promise with a boolean hasScrolledToPosition set to false
            resolve(false);
        };
        // Registering animation so it can be canceled if function
        // gets called again on the same element
        activeAnimations.add(options.elementToScroll, cancelAnimation);
        // Prevent user actions handler
        var preventDefaultHandler = function (e) { return e.preventDefault(); };
        var handler = options.cancelOnUserAction ?
            cancelAnimation :
            preventDefaultHandler;
        // If animation is not cancelable by the user, we can't use passive events
        var eventOptions = options.cancelOnUserAction ?
            { passive: true } :
            { passive: false };
        var events = [
            'wheel',
            'touchstart',
            'keydown',
            'mousedown',
        ];
        // Function to remove listeners after animation is finished
        var removeListeners = function () {
            events.forEach(function (eventName) {
                options.elementToScroll.removeEventListener(eventName, handler);
            });
        };
        // Add listeners
        events.forEach(function (eventName) {
            options.elementToScroll.addEventListener(eventName, handler, eventOptions);
        });
        // Animation
        var startingTime = Date.now();
        var step = function () {
            var timeDiff = Date.now() - startingTime;
            var t = timeDiff / duration;
            var horizontalScrollPosition = Math.round(initialHorizontalScroll + (horizontalDistanceToScroll * options.easing(t)));
            var verticalScrollPosition = Math.round(initialVerticalScroll + (verticalDistanceToScroll * options.easing(t)));
            if (timeDiff < duration && (horizontalScrollPosition !== x || verticalScrollPosition !== y)) {
                // If scroll didn't reach desired position or time is not elapsed
                // Scroll to a new position
                elementToScroll.scrollTo(horizontalScrollPosition, verticalScrollPosition);
                // And request a new step
                requestID = requestAnimationFrame(step);
            }
            else {
                // If the time elapsed or we reached the desired offset
                // Set scroll to the desired offset (when rounding made it to be off a pixel or two)
                // Clear animation frame to be sure
                elementToScroll.scrollTo(x, y);
                cancelAnimationFrame(requestID);
                // Remove listeners
                removeListeners();
                // Resolve promise with a boolean hasScrolledToPosition set to true
                resolve(true);
            }
        };
        // Start animating scroll
        requestID = requestAnimationFrame(step);
    });
}
exports.default = animateScrollTo;
// Support for direct usage in browsers
// This is mostly to keep it similar to v1
// Don't forget to include Promise polyfill for IE
// <script src="https://unpkg.com/es6-promise/dist/es6-promise.auto.min.js"></script>
// https://github.com/stefanpenner/es6-promise
// @ts-ignore
window.animateScrollTo = animateScrollTo;
