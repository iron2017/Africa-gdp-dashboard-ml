// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import

import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';

import { MapVisualizationComponent } from '../../theme/shared/components/map-visualization/map-visualization.component';
import { ChartDataService } from 'src/app/theme/shared/services/chart-data.service';
import { TableVisualizationComponent } from '../../theme/shared/components/table-visualization/table-visualization.component';

@Component({
  selector: 'app-default',
  imports: [CommonModule, BarChartComponent, MapVisualizationComponent, TableVisualizationComponent],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  // public method

  highestGDP = 0;
  highestGDPCountry = '';
  highestPopulation = 0;
  highestPopulationCountry = '';

  constructor(private chartDataService: ChartDataService) {}

  ngOnInit() {
    this.chartDataService.getChartData().subscribe((csvData) => {
      const lines = csvData.split('\n').slice(1);
      lines.forEach((line) => {
        const cells = line.split(',');
        const country = cells[2];
        const population = parseInt(cells[4], 10);
        const gdp = parseFloat(cells[5]) || 0;

        if (gdp > this.highestGDP) {
          this.highestGDP = gdp;
          this.highestGDPCountry = country;
        }

        if (population > this.highestPopulation) {
          this.highestPopulation = population;
          this.highestPopulationCountry = country;
        }
      });
    });
  }
}
