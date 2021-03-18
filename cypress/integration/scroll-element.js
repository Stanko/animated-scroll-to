describe('Scrolling the element', function () {
  Cypress.on('window:before:load', (win) => {
    cy.spy(win.console, 'warn');
  });

  it('scrolls the element vertically', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        return win
          .animateScrollTo(1000, {
            elementToScroll: elementToScroll[0],
          })
          .then(() => {
            cy.expect(elementToScroll[0].scrollTop).to.equal(1000);
          });
      }, 1000);
    }, 1000);
  });

  it('scrolls the element horizontally and vertically', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        return win
          .animateScrollTo([500, 500], {
            elementToScroll: elementToScroll[0],
          })
          .then(() => {
            cy.expect(elementToScroll[0].scrollTop).to.equal(500);
            cy.expect(elementToScroll[0].scrollLeft).to.equal(500);
          });
      }, 1000);
    }, 1000);
  });

  it('scrolls the element horizontally only', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        const currentY = elementToScroll[0].scrollTop;

        return win
          .animateScrollTo([500, null], {
            elementToScroll: elementToScroll[0],
          })
          .then(() => {
            cy.expect(elementToScroll[0].scrollLeft).to.equal(500);
            cy.expect(elementToScroll[0].scrollTop).to.equal(currentY);
          });
      }, 1000);
    }, 1000);
  });

  it('scrolls the element vertically only', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        const currentX = elementToScroll[0].scrollLeft;

        return win
          .animateScrollTo([null, 1000], {
            elementToScroll: elementToScroll[0],
          })
          .then(() => {
            cy.expect(elementToScroll[0].scrollLeft).to.equal(currentX);
            cy.expect(elementToScroll[0].scrollTop).to.equal(1000);
          });
      }, 1000);
    }, 1000);
  });

  it('scrolls the element to element', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        cy.get('.element-scroll-to').then((elementToScrollTo) => {
          return win
            .animateScrollTo(elementToScrollTo[0], {
              elementToScroll: elementToScroll[0],
            })
            .then(() => {
              // Margins are hard coded in CSS
              cy.expect(elementToScroll[0].scrollLeft).to.equal(1000);
              cy.expect(elementToScroll[0].scrollTop).to.equal(1000);
            });
        }, 1000);
      }, 1000);
    }, 1000);
  });

  it('scrolls the element horizontally and vertically with offset', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        return win
          .animateScrollTo([500, 500], {
            verticalOffset: 100,
            horizontalOffset: 100,
            elementToScroll: elementToScroll[0],
          })
          .then(() => {
            cy.expect(elementToScroll[0].scrollTop).to.equal(600);
            cy.expect(elementToScroll[0].scrollLeft).to.equal(600);
          });
      }, 1000);
    }, 1000);
  });

  it('checks if console.warn is called when scroll-behavior: smooth is set', function () {
    cy.visit('http://localhost:8088');

    cy.window().then((win) => {
      cy.get('.element-to-scroll').then((elementToScroll) => {
        elementToScroll[0].style.scrollBehavior = 'smooth';

        return win
          .animateScrollTo(1000, {
            elementToScroll: elementToScroll[0],
          })
          .then(() => {
            cy.expect(win.console.warn).to.have.callCount(1);
          });
      }, 1000);
    }, 1000);
  });
});
