# animated-scroll-to

[![npm version](https://img.shields.io/npm/v/animated-scroll-to.svg?style=flat-square)](https://www.npmjs.com/package/animated-scroll-to)
[![npm downloads](https://img.shields.io/npm/dm/animated-scroll-to.svg?style=flat-square)](https://www.npmjs.com/package/animated-scroll-to)

Animated JavaScript window and element scroll.
Simple, plain JavaScript scrollTo function.

[Changelog](CHANGELOG.md).

## Demo

Demo is available on [this page](https://stanko.github.io/animated-scroll-to/).

## What is this?

This is a plain JavaScript animated scroll to function.
It has easing, and accepts speed per 1000px rather than duration.
Then function recalculates the duration,
and sets the minimum of 250ms or maximum of 3000ms.
If you give it offset which is larger from the maximum scroll value, it will use latter.
Also it disables user scrolling while scroll animation is in progress.
And also, you can give it HTML DOM Element to scroll to.

Script doesn't prevent multiple calls of it.

## Installation

Get it from npm

```
npm install animated-scroll-to
```

import it in your app

```javascript
import animateScrollTo from 'animated-scroll-to';
```

and call it when you need it

```javascript
animateScrollTo(500);

or

animateScrollTo(document.querySelector('.my-element'));
```

You can also use the standalone build, by including `animated-scroll-to.js` in your page, but it is not recommended.

## Options

```javascript
// desiredOffset - page offset to scroll
// options - object with options

// default options
const options = {
  // duration of the scroll per 1000px, default 500
  speed: 500,

  // minimum duration of the scroll
  minDuration: 250,

  // maximum duration of the scroll
  maxDuration: 1500,

  // DOM element to scroll, default window
  // Pass a reference to a DOM object
  // Example: document.querySelector('#element-to-scroll'),
  element: window,

  // Additional offset value that gets added to the desiredOffset.  This is
  // useful when passing a DOM object as the desiredOffset and wanting to adjust
  // for an fixed nav or to add some padding.
  offset: 0,

  // should animated scroll be canceled on user scroll/keypress
  // if set to "false" user input will be disabled until animated scroll is complete
  // (when set to false, "passive" will be also set to "false" to prevent Chrome errors)
  cancelOnUserAction: true,

  // Set passive event Listeners to be true by default. Stops Chrome from complaining.
  passive: true,

  // Scroll horizontally rather than vertically (which is the default)
  horizontal: true,

  // function that will be executed when the scroll animation is finished
  onComplete: function() {}
};

const desiredOffset = 1000;

animateScrollTo(desiredOffset, options);
```

## Why?

I wasn't able to find standalone, simple and working solution.

## Browser support

Anything that supports `requestAnimationFrame`, meaning IE10+. For IE9 just provide a polyfill for it.

For IE8 and lower, you'll  need to polyfill `Object.keys` and `Array.forEach` as well. Haven't tested this though.


## It is missing &lt;insert feature here&gt;

I really tried to keep simple and lightweight.
If you are missing something, feel free to add it and open a pull request.
