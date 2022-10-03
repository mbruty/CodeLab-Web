describe("Sign up form", () => {
	beforeEach(() => {
		cy.visit("/join");
	});
	it("Name validation less than 10", () => {
		const name = cy.get("#name");

		name.type("mike");
		cy.get(".v-messages__message").should("not.exist");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Name validation greater than 10", () => {
		const name = cy.get("#name");

		name.type("mike wazowski");
		cy.contains("div", "Name must be less than 10 characters");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Name empty", () => {
		const name = cy.get("#name");

		name.type("a{backspace}");
		cy.contains("div", "Name is required");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Email validation correct", () => {
		const email = cy.get("#email");

		email.type("fake@email.com").should("have.value", "fake@email.com");
		cy.get(".v-messages__message").should("not.exist");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Email validation incorrect", () => {
		const email = cy.get("#email");
		email.type("nota@email");

		cy.contains("div", "E-mail must be valid");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Email empty", () => {
		const name = cy.get("#email");

		name.type("a{backspace}");
		cy.contains("div", "E-mail is required");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Password less than 8, only lowercase", () => {
		const name = cy.get("#password");

		name.type("a");
		cy.contains(
			"div",
			"Password requires: 8 characters | 1 Uppercase letter, | 1 Lowercase letter, | 1 Number, | 1 Special"
		);
		cy.get("button").should("have.attr", "disabled");
	});
	it("Password greater than 8, only lowercase", () => {
		const name = cy.get("#password");

		name.type("abcdefghi");
		cy.contains(
			"div",
			"Password requires: 8 characters | 1 Uppercase letter, | 1 Lowercase letter, | 1 Number, | 1 Special"
		);
		cy.get("button").should("have.attr", "disabled");
	});
	it("Password greater than 8, lowercase and 1 uppercase", () => {
		const name = cy.get("#password");

		name.type("Abcdefghi");
		cy.contains(
			"div",
			"Password requires: 8 characters | 1 Uppercase letter, | 1 Lowercase letter, | 1 Number, | 1 Special"
		);
		cy.get("button").should("have.attr", "disabled");
	});
	it("Password greater than 8, lowercase and 1 uppercase and 1 number", () => {
		const name = cy.get("#password");

		name.type("Abcdefgh1");
		cy.contains(
			"div",
			"Password requires: 8 characters | 1 Uppercase letter, | 1 Lowercase letter, | 1 Number, | 1 Special"
		);
		cy.get("button").should("have.attr", "disabled");
	});
	it("Password greater than 8, lowercase and 1 uppercase and 1 number 1 special", () => {
		const name = cy.get("#password");

		name.type("Abcdefgh1!");
		cy.get(".v-messages__message").should("not.exist");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Passwords don't match", () => {
		cy.get("#password").type("Abcdefgh1!");
		cy.get("#passwordConf").type("A");

		cy.contains("div", "Passwords do not match");
		cy.get("button").should("have.attr", "disabled");
	});
	it("Button is enabled on valid data", () => {
		cy.get("#submit").should("have.attr", "disabled");
		cy.get("#name").type("Cypress");
		cy.get("#email").type("b41191d0-a0ad-4887-abf7-141b0faacf8a@cypress.com");
		cy.get("#password").type("Abcdefgh1!");
		cy.get("#passwordConf").type("Abcdefgh1!");
		cy.get("#submit").should("not.have.attr", "disabled");
	});
	it("Navigates to /dashboard on valid submission", () => {
		cy.get("#submit").should("have.attr", "disabled");
		cy.get("#name").type("Cypress");
		cy.get("#email").type("b41191d0-a0ad-4887-abf7-141b0faacf8a@cypress.com");
		cy.get("#password").type("Abcdefgh1!");
		cy.get("#passwordConf").type("Abcdefgh1!");
		cy.get("#submit").should("not.have.attr", "disabled");
		cy.get("#submit").click();
		cy.location("pathname").should("equal", "\/dashboard");
	});
});
