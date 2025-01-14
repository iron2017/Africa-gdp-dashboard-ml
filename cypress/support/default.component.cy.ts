import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DefaultComponent } from '../../src/app/dashboard/default/default.component';
import { ChartDataService } from 'src/app/theme/shared/services/chart-data.service';
import { of } from 'rxjs';
import { mount } from '@cypress/angular';

describe('DefaultComponent', () => {
  const mockCsvData = `id,name,country,continent,population,gdp
1,Test1,USA,NA,1000000,20000000
2,Test2,China,AS,2000000,15000000`;

  beforeEach(() => {
    mount(DefaultComponent, {
      imports: [NgbModule],
      providers: [
        {
          provide: ChartDataService,
          useValue: { getChartData: () => of(mockCsvData) }
        }
      ]
    });
  });

  it('should render GDP card correctly', () => {
    cy.get('[data-cy="highestGDP-value"]').should('contain', '$20,000,000');
    cy.get('[data-cy="highestGDP-country"]').should('contain', 'USA');
  });

  it('should render population card correctly', () => {
    cy.get('[data-cy="highestPopulation-value"]').should('contain', '2,000,000');
    cy.get('[data-cy="highestPopulation-country"]').should('contain', 'China');
  });

  it('should show dropdown menu when clicked', () => {
    cy.get('.dropdown-toggle').first().click();
    cy.get('.dropdown-menu').should('be.visible');
    cy.get('.dropdown-item').should('have.length', 2);
  });

  it('should render visualization components', () => {
    cy.get('app-bar-chart').should('exist');
    cy.get('app-map-visualization').should('exist');
    cy.get('app-table-visualization').should('exist');
  });

  it('should handle empty data gracefully', () => {
    mount(DefaultComponent, {
      imports: [NgbModule],
      providers: [
        {
          provide: ChartDataService,
          useValue: { getChartData: () => of('id,name,country,continent,population,gdp') }
        }
      ]
    });
    cy.get('[data-cy="highestGDP-value"]').should('contain', '$0');
    cy.get('[data-cy="highestPopulation-value"]').should('contain', '0');
  });
});
