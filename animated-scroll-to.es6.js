// desiredOffset - page offset to scroll to
// speed - duration of the scroll per 1000px
function animateScrollTo(desiredOffset, speed = 500) {
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
  let duration = Math.abs(Math.round((diff / 1000) * speed));

  // Set minimum and maximum duration
  if (duration < 250) {
    duration = 250;
  } else if (duration > 3000) {
    duration = 3000;
  }

  const startingTime = Date.now();

  // Method to disable scroll
  const disableScroll = function(e) { e.preventDefault(); };
  // Disable user scroll while animating scroll
  window.addEventListener('scroll', disableScroll);
  window.addEventListener('wheel', disableScroll);
  window.addEventListener('touchstart', disableScroll);

  let requestID = null;

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

      // Enable user scroll again
      window.removeEventListener('scroll', disableScroll);
      window.removeEventListener('wheel', disableScroll);
      window.removeEventListener('touchstart', disableScroll);
    }
  };

  // Start animating scroll
  requestID = requestAnimationFrame(step);
}
