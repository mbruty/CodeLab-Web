/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

declare namespace Cypress {
  interface Chainable {
    login(apiUrl: string, email?: string, password?: string): Chainable;
  }
}

Cypress.Commands.add(
  "login",
  (apiUrl, email = "ci@bruty.net", password = "ci123!") => {
    function login() {
      cy.intercept("POST", apiUrl).as("graphql");
      cy.visit("/log-in");
      cy.get("#email").type(email);
      cy.get("#password").type(password);
      cy.get("#submit").click();
      cy.location("pathname").should("eq", "/");
    }
    cy.session([email, password], login)
  }
);
