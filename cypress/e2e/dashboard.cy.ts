describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/default');
    // Wait for data to load
    cy.wait(1000);
  });

  it('should display dashboard cards with correct data', () => {
    // GDP Card
    cy.get('[data-cy="highestGDP-value"]').should('be.visible').and('not.be.empty');
    cy.get('[data-cy="highestGDP-country"]').should('be.visible').and('contain', 'Highest GDP:');

    // Population Card
    cy.get('[data-cy="highestPopulation-value"]').should('be.visible').and('not.be.empty');
    cy.get('[data-cy="highestPopulation-country"]').should('be.visible').and('contain', 'Highest Population:');
  });

  it('should have working dropdown menus', () => {
    // Test GDP card dropdown
    cy.get('.dropdown-toggle').first().click();
    cy.get('.dropdown-menu')
      .first()
      .should('be.visible')
      .within(() => {
        cy.contains('Import Card').should('be.visible');
        cy.contains('Export').should('be.visible');
      });

    // Test Population card dropdown
    cy.get('.dropdown-toggle').last().click();
    cy.get('.dropdown-menu')
      .last()
      .should('be.visible')
      .within(() => {
        cy.contains('Import Card').should('be.visible');
        cy.contains('Export').should('be.visible');
      });
  });

  it('should display all visualization components', () => {
    // Check if charts are rendered
    cy.get('app-bar-chart').should('exist').and('be.visible');

    cy.get('app-map-visualization').should('exist').and('be.visible');

    cy.get('app-table-visualization').should('exist').and('be.visible');
  });

  it('should maintain layout on different viewport sizes', () => {
    // Test on mobile
    cy.viewport('iphone-x');
    cy.get('[data-cy="highestGDP-value"]').should('be.visible');
    cy.get('[data-cy="highestPopulation-value"]').should('be.visible');

    // Test on tablet
    cy.viewport('ipad-2');
    cy.get('[data-cy="highestGDP-value"]').should('be.visible');
    cy.get('[data-cy="highestPopulation-value"]').should('be.visible');

    // Test on desktop
    cy.viewport(1920, 1080);
    cy.get('[data-cy="highestGDP-value"]').should('be.visible');
    cy.get('[data-cy="highestPopulation-value"]').should('be.visible');
  });
});
