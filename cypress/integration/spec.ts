it("loads examples", () => {
  cy.visit("http://localhost:4200");
  cy.contains("we are doing big things!");
});
