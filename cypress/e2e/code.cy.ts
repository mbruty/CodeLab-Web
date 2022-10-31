import { API_URL } from "../../src/config";

describe("Code editor", () => {
  before(() => {
    Cypress.Cookies.debug(true);
  });
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("access_token", "refresh_token");
    cy.visit("/code/1");
  });
  it("Redirects to login with no authentication cookies", () => {
    cy.clearCookie("access_token");
    cy.clearCookie("refresh_token");
    cy.visit("/code/1");
    cy.location("pathname").should("eq", "/log-in");
    cy.intercept("POST", API_URL).as("graphql");
    cy.get("#login-as-demo").click();
    cy.wait("@graphql");
    cy.location("pathname").should("eq", "/");
  });

  it("Shows loading spinner", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.get("#spinner").should("be.visible");
  });

  it("Shows correct languages", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.wait("@graphql"); // Get task
    cy.get("#language-select").click();
    cy.get(".MuiMenu-list")
      .should("contain.text", "C#")
      .should("contain.text", "JavaScript")
      .should("contain.text", "TypeScript");
  });

  it("Loads new content when changing language", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.get("#language-select").click();
    cy.get("#language-select-Csharp").click();
    cy.wait("@graphql").then((interception) => {
      assert.isNotNull(interception.response);
      assert.isNotNull(interception.response?.body);
      const task = interception.response?.body.data.programmingTask;
      assert.equal(
        task.starterCode,
        "namespace program;\npublic class Solution\n{\n    public static int Solve(int x)\n    {\n        // Your code here\n        return x;\n    }\n}"
      );
    }); // Get updated task
  });

  it("Resets code", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.get(".view-line").eq(1).type("{end}{leftArrow} * 2");
    cy.wait("@graphql"); // Save Solution

    // Reset solution
    cy.get("#reset-solution").click();
    cy.wait("@graphql"); // Save

    cy.get(".view-line").eq(0).contains("return");
    cy.get(".view-line").eq(0).contains("args");
    cy.get(".view-line").eq(0).contains(";");
    cy.get(".view-line").eq(0).contains("*").should("not.exist");
    cy.get(".view-line").eq(0).contains("2").should("not.exist");
  });

  it("Executes code failure", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.get("#run-code").click();
    cy.wait("@graphql"); // Execute
    cy.get(".output--failure").should("be.visible");
    cy.get(".output--success").should("not.exist");
  });

  it("Executes code success", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.get(".view-line").eq(1).type("{end}{leftArrow} * 2");
    cy.wait("@graphql"); // Save Solution
    cy.get("#run-code").click();
    cy.wait("@graphql"); // Execute
    cy.get(".output--failure").should("not.exist");
    cy.get(".output--success").should("be.visible");

    // Reset solution
    cy.get("#reset-solution").click();
    cy.wait("@graphql"); // Save
  });

  it("Displays stats", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.get("#run-code").click();
    cy.wait("@graphql"); // Execute
    cy.get("tr").should("be.visible");
  });
});
