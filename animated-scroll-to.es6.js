// desiredOffset - page offset to scroll to
// speed - duration of the scroll per 1000px
function animateScrollTo(desiredOffset, userOptions = {}) {
  const defaultOptions = {
    speed: 500,
    minDuration: 250,
    maxDuration: 3000,
    cancelOnUserAction: true,
  };

  const options = {};

  Object.keys(defaultOptions).forEach((key) => {
    options[key] = userOptions[key] ? userOptions[key] : defaultOptions[key];
  });

  // get cross browser scroll position
  const initialScrollPosition = window.scrollY || document.documentElement.scrollTop;
  // cross browser document height minus window height
  const maxScroll = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  ) - window.innerHeight;

  // If the scroll position is greater than maximum available scroll
  if (desiredOffset > maxScroll) {
    desiredOffset = maxScroll;
  }

  // Calculate diff to scroll
  const diff = desiredOffset - initialScrollPosition;

  // Do nothing if the page is already there
  if (diff === 0) {
    return;
  }

  // Calculate duration of the scroll
  let duration = Math.abs(Math.round((diff / 1000) * options.speed));

  // Set minimum and maximum duration
  if (duration < options.minDuration) {
    duration = options.minDuration;
  } else if (duration > options.maxDuration) {
    duration = options.maxDuration;
  }

  const startingTime = Date.now();

  // Request animation frame ID
  let requestID = null;

  // Method handler
  let handleUserEvent = null;

  if (options.cancelOnUserAction) {
    // Set handler to cancel scroll on user action
    handleUserEvent = function(e) { cancelAnimationFrame(requestID); };
    window.addEventListener('keydown', handleUserEvent);
  } else {
    // Set handler to prevent user actions while scroll is active
    handleUserEvent = function(e) { e.preventDefault(); };
    window.addEventListener('scroll', handleUserEvent);
  }

  window.addEventListener('wheel', handleUserEvent);
  window.addEventListener('touchstart', handleUserEvent);

  const step = function () {
    const timeDiff = Date.now() - startingTime;
    const t = (timeDiff / duration) - 1;
    const easing = t * t * t + 1;
    const scrollPosition = Math.round(initialScrollPosition + (diff * easing));

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

export default animateScrollTo;
