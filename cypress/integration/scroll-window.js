describe("Scrolling the window", function() {
  it("scrolls the window vertically", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      return win.animateScrollTo(1000).then(() => {
        cy.expect(win.scrollY).to.equal(1000);
      });
    }, 1000);
  });

  it("scrolls the window horizontally and vertically", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      return win.animateScrollTo([500, 500]).then(() => {
        cy.expect(win.scrollY).to.equal(500);
        cy.expect(win.scrollX).to.equal(500);
      });
    }, 1000);
  });

  it("scrolls the window horizontally only", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      const currentY = win.scrollY;

      return win.animateScrollTo([500, null]).then(() => {
        cy.expect(win.scrollX).to.equal(500);
        cy.expect(win.scrollY).to.equal(currentY);
      });
    }, 1000);
  });

  it("scrolls the window vertically only", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      const currentX = win.scrollX;

      return win.animateScrollTo([null, 1000]).then(() => {
        cy.expect(win.scrollX).to.equal(currentX);
        cy.expect(win.scrollY).to.equal(1000);
      });
    }, 1000);
  });

  it("scrolls the window to element", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      cy.get(".window-scroll-to").then(elementToScrollTo => {
        return win.animateScrollTo(elementToScrollTo[0]).then(() => {
          // Margins are hard coded in CSS
          cy.expect(win.scrollX).to.equal(1000);
          cy.expect(win.scrollY).to.equal(1000);
        });
      }, 1000);
    }, 1000);
  });

  it("scrolls the window horizontally and vertically with offset", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      return win
        .animateScrollTo([500, 500], {
          verticalOffset: 100,
          horizontalOffset: 100
        })
        .then(() => {
          cy.expect(win.scrollY).to.equal(600);
          cy.expect(win.scrollX).to.equal(600);
        });
    }, 1000);
  });

  it("animation finishes in correct duration when min and max durations are the same", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      const start = Date.now();
      const THRESHOLD = 1000;
      const DURATION = 500;

      return win
        .animateScrollTo([500, 500], {
          minDuration: DURATION,
          maxDuration: DURATION,
          // Using linear easing to be sure timings are correct
          easing: t => t,
        })
        .then(() => {
          const timePassed = Date.now() - start;
          cy.expect(Math.abs(timePassed - DURATION)).to.be.lessThan(THRESHOLD);
        });
    }, 1000);
  });

  it("animation finishes in correct duration when speed is set", function() {
    cy.visit("http://localhost:1234");

    cy.window().then(win => {
      const start = Date.now();
      const THRESHOLD = 1000;
      const DURATION = 1000; // 1000px at 1000px per second = 1000ms

      win.scrollTo(0, 0);

      return win
        .animateScrollTo(1000, {
          minDuration: 0,
          maxDuration: 99999,
          speed: 1000,
          // Using linear easing to be sure timings are correct
          easing: t => t,
        })
        .then(() => {
          const timePassed = Date.now() - start;
          cy.expect(Math.abs(timePassed - DURATION)).to.be.lessThan(THRESHOLD);
        });
    }, 1000);
  });
});
