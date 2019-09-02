// import { JSDOM } from 'jsdom';

// import animateScrollTo from './animated-scroll-to';

// const jsdom = new JSDOM('<!doctype html><html><body style="height: 3000px"></body></html>');

// window = jsdom.window;
// document = window.document;


// // global.scrollTo = jest.fn((x:number, y:number) => {
// //   global.scrollX = x;
// //   global.scrollY = y;
// // });

// //  // Change the viewport to 500px.
// //  global.innerWidth = 500;


// test('adds 1 + 2 to equal 3', () => {
//   setInterval(() => {
//     console.log(window.scrollY);
//   }, 50);
//   return animateScrollTo([100, 100], {
//     // minDuration: 3000,
//     // maxDuration: 3000,
//   }).then(() => {
//     console.log(window.scrollY);
//     // expect(true).toBe(true);
//     expect(window.scrollTo).toHaveBeenCalledWith(100, 100);
//   });
// });
