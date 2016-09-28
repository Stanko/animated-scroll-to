'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// desiredOffset - page offset to scroll to
// speed - duration of the scroll per 1000px
function animateScrollTo(desiredOffset) {
  var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var defaultOptions = {
    speed: 500,
    minDuration: 250,
    maxDuration: 3000,
    cancelOnUserAction: true
  };

  var options = {};

  Object.keys(defaultOptions).forEach(function (key) {
    options[key] = userOptions[key] ? userOptions[key] : defaultOptions[key];
  });

  // get cross browser scroll position
  var initialScrollPosition = window.scrollY || document.documentElement.scrollTop;
  // cross browser document height minus window height
  var maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - window.innerHeight;

  // If the scroll position is greater than maximum available scroll
  if (desiredOffset > maxScroll) {
    desiredOffset = maxScroll;
  }

  // Calculate diff to scroll
  var diff = desiredOffset - initialScrollPosition;

  // Do nothing if the page is already there
  if (diff === 0) {
    return;
  }

  // Calculate duration of the scroll
  var duration = Math.abs(Math.round(diff / 1000 * options.speed));

  // Set minimum and maximum duration
  if (duration < options.minDuration) {
    duration = options.minDuration;
  } else if (duration > options.maxDuration) {
    duration = options.maxDuration;
  }

  var startingTime = Date.now();

  // Request animation frame ID
  var requestID = null;

  // Method handler
  var handleUserEvent = null;

  if (options.cancelOnUserAction) {
    // Set handler to cancel scroll on user action
    handleUserEvent = function handleUserEvent(e) {
      cancelAnimationFrame(requestID);
    };
    window.addEventListener('keydown', handleUserEvent);
  } else {
    // Set handler to prevent user actions while scroll is active
    handleUserEvent = function handleUserEvent(e) {
      e.preventDefault();
    };
    window.addEventListener('scroll', handleUserEvent);
  }

  window.addEventListener('wheel', handleUserEvent);
  window.addEventListener('touchstart', handleUserEvent);

  var step = function step() {
    var timeDiff = Date.now() - startingTime;
    var t = timeDiff / duration - 1;
    var easing = t * t * t + 1;
    var scrollPosition = Math.round(initialScrollPosition + diff * easing);

    if (timeDiff < duration && scrollPosition !== desiredOffset) {
      // If scroll didn't reach desired offset or time is not elapsed
      // Scroll to a new position
      // And request a new step

      window.scrollTo(0, scrollPosition);
      requestID = requestAnimationFrame(step);
    } else {
      // If the time elapsed or we reached the desired offset
      // Set scroll to the desired offset (when rounding made it to be off a pixel or two)
      // Clear animation frame to be sure
      window.scrollTo(0, desiredOffset);
      cancelAnimationFrame(requestID);

      // Remove listeners
      window.removeEventListener('wheel', handleUserEvent);
      window.removeEventListener('touchstart', handleUserEvent);

      if (options.cancelOnUserAction) {
        window.removeEventListener('keydown', handleUserEvent);
      } else {
        window.removeEventListener('scroll', handleUserEvent);
      }
    }
  };

  // Start animating scroll
  requestID = requestAnimationFrame(step);
}

exports.default = animateScrollTo;
