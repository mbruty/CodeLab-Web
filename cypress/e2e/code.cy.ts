import { API_URL } from "../../src/config";

describe("Code editor", () => {
  beforeEach(() => {
    cy.login(API_URL);
    cy.visit("/code/1");
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

  it("Displays stats", () => {
    cy.intercept("POST", API_URL).as("graphql");
    cy.wait("@graphql"); // Auth Check
    cy.wait("@graphql"); // Get task
    cy.get("#run-code").click();
    cy.wait("@graphql"); // Execute
    cy.get("tr").should("be.visible");
  });
});
