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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// --------- SCROLL INTERFACES
function getElementOffset(el) {
    var top = 0;
    var left = 0;
    var element = el;
    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);
    return {
        top: top,
        left: left,
    };
}
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
    ScrollDomElement.prototype.getHorizontalElementScrollOffset = function (elementToScrollTo, elementToScroll) {
        return getElementOffset(elementToScrollTo).left - getElementOffset(elementToScroll).left;
    };
    ScrollDomElement.prototype.getVerticalElementScrollOffset = function (elementToScrollTo, elementToScroll) {
        return getElementOffset(elementToScrollTo).top - getElementOffset(elementToScroll).top;
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
    remove: function (element, shouldStop) {
        if (shouldStop === void 0) { shouldStop = true; }
        var index = activeAnimations.elements.indexOf(element);
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
var WINDOW_EXISTS = typeof window !== 'undefined';
// --------- ANIMATE SCROLL TO
var defaultOptions = {
    cancelOnUserAction: true,
    easing: function (t) { return (--t) * t * t + 1; },
    elementToScroll: WINDOW_EXISTS ? window : null,
    horizontalOffset: 0,
    maxDuration: 3000,
    minDuration: 250,
    speed: 500,
    verticalOffset: 0,
};
function animateScrollTo(numberOrCoordsOrElement, userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var x, y, scrollToElement, options, isWindow, isElement, elementToScroll, maxHorizontalScroll, initialHorizontalScroll, horizontalDistanceToScroll, maxVerticalScroll, initialVerticalScroll, verticalDistanceToScroll, horizontalDuration, verticalDuration, duration;
        return __generator(this, function (_a) {
            // Check for server rendering
            if (!WINDOW_EXISTS) {
                // @ts-ignore
                // If it still gets called on server, return Promise for API consistency
                return [2 /*return*/, new Promise(function (resolve) {
                        resolve(false); // Returning false on server
                    })];
            }
            else if (!window.Promise) {
                throw ('Browser doesn\'t support Promises, and animated-scroll-to depends on it, please provide a polyfill.');
            }
            options = __assign(__assign({}, defaultOptions), userOptions);
            isWindow = options.elementToScroll === window;
            isElement = !!options.elementToScroll.nodeName;
            if (!isWindow && !isElement) {
                throw ('Element to scroll needs to be either window or DOM element.');
            }
            elementToScroll = isWindow ?
                new ScrollWindow() :
                new ScrollDomElement(options.elementToScroll);
            if (numberOrCoordsOrElement instanceof Element) {
                scrollToElement = numberOrCoordsOrElement;
                // If "elementToScroll" is not a parent of "scrollToElement"
                if (isElement &&
                    (!options.elementToScroll.contains(scrollToElement) ||
                        options.elementToScroll.isSameNode(scrollToElement))) {
                    throw ('options.elementToScroll has to be a parent of scrollToElement');
                }
                x = elementToScroll.getHorizontalElementScrollOffset(scrollToElement, options.elementToScroll);
                y = elementToScroll.getVerticalElementScrollOffset(scrollToElement, options.elementToScroll);
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
            maxHorizontalScroll = elementToScroll.getMaxHorizontalScroll();
            initialHorizontalScroll = elementToScroll.getHorizontalScroll();
            // If user specified scroll position is greater than maximum available scroll
            if (x > maxHorizontalScroll) {
                x = maxHorizontalScroll;
            }
            horizontalDistanceToScroll = x - initialHorizontalScroll;
            maxVerticalScroll = elementToScroll.getMaxVerticalScroll();
            initialVerticalScroll = elementToScroll.getVerticalScroll();
            // If user specified scroll position is greater than maximum available scroll
            if (y > maxVerticalScroll) {
                y = maxVerticalScroll;
            }
            verticalDistanceToScroll = y - initialVerticalScroll;
            horizontalDuration = Math.abs(Math.round((horizontalDistanceToScroll / 1000) * options.speed));
            verticalDuration = Math.abs(Math.round((verticalDistanceToScroll / 1000) * options.speed));
            duration = horizontalDuration > verticalDuration ? horizontalDuration : verticalDuration;
            // Set minimum and maximum duration
            if (duration < options.minDuration) {
                duration = options.minDuration;
            }
            else if (duration > options.maxDuration) {
                duration = options.maxDuration;
            }
            // @ts-ignore
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    // Scroll is already in place, nothing to do
                    if (horizontalDistanceToScroll === 0 && verticalDistanceToScroll === 0) {
                        // Resolve promise with a boolean hasScrolledToPosition set to true
                        resolve(true);
                    }
                    // Cancel existing animation if it is already running on the same element
                    activeAnimations.remove(options.elementToScroll, true);
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
                            options.elementToScroll.removeEventListener(eventName, handler, eventOptions);
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
                            // Remove animation from the active animations coordinator
                            activeAnimations.remove(options.elementToScroll, false);
                            // Resolve promise with a boolean hasScrolledToPosition set to true
                            resolve(true);
                        }
                    };
                    // Start animating scroll
                    requestID = requestAnimationFrame(step);
                })];
        });
    });
}
exports.default = animateScrollTo;
// Support for direct usage in browsers
// This is mostly to keep it similar to v1
// Don't forget to include Promise polyfill for IE
// <script src="https://unpkg.com/es6-promise/dist/es6-promise.auto.min.js"></script>
// https://github.com/stefanpenner/es6-promise
if (WINDOW_EXISTS) {
    window.animateScrollTo = animateScrollTo;
}
