'use strict';

// desiredOffset - page offset to scroll to
// speed - duration of the scroll per 1000px
function animateScrollTo(desiredOffset) {
  var speed = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];

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
  var duration = Math.abs(Math.round(diff / 1000 * speed));

  // Set minimum and maximum duration
  if (duration < 250) {
    duration = 250;
  } else if (duration > 3000) {
    duration = 3000;
  }

  var startingTime = Date.now();

  // Method to disable scroll
  var disableScroll = function disableScroll(e) {
    e.preventDefault();
  };
  // Disable user scroll while animating scroll
  window.addEventListener('scroll', disableScroll);
  window.addEventListener('wheel', disableScroll);
  window.addEventListener('touchstart', disableScroll);

  var requestID = null;

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

      // Enable user scroll again
      window.removeEventListener('scroll', disableScroll);
      window.removeEventListener('wheel', disableScroll);
      window.removeEventListener('touchstart', disableScroll);
    }
  };

  // Start animating scroll
  requestID = requestAnimationFrame(step);
}
