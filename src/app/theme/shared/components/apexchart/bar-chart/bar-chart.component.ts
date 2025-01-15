import { Component, ViewChild, OnInit } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { ChartDataService } from '../../../services/chart-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h5>Data Analytics</h5>
        <select [(ngModel)]="viewMode" (ngModelChange)="updateChartData()">
          <option value="year">By Year</option>
          <option value="country">By Country</option>
          <option value="continent">By Continent</option>
        </select>
      </div>
      <div class="card-body">
        <apx-chart
          #chart
          [series]="chartOptions.series"
          [chart]="chartOptions.chart"
          [xaxis]="chartOptions.xaxis"
          [dataLabels]="chartOptions.dataLabels"
          [colors]="chartOptions.colors"
          [tooltip]="chartOptions.tooltip"
        ></apx-chart>
      </div>
    </div>
  `
})
export class BarChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: Partial<ApexOptions>;
  viewMode: 'year' | 'country' | 'continent' = 'country';
  private groupedData: Record<string, Record<string, { population: number; gdp: number }>> = {
    byYear: {},
    byCountry: {},
    byContinent: {}
  };

  constructor(private chartDataService: ChartDataService) {
    this.chartOptions = {
      series: [],
      dataLabels: { enabled: false },
      chart: {
        type: 'line',
        height: 480,
        toolbar: { show: true },
        background: 'transparent'
      },
      colors: ['#d3eafd', '#2196f3'],
      xaxis: { categories: [] }
    };
  }

  ngOnInit() {
    this.chartDataService.getChartData().subscribe((csvData) => {
      this.processData(csvData);
      this.updateChartData();
    });
  }

  private processData(csvData: string) {
    const [, ...lines] = csvData.split('\n');
    lines.forEach((line) => {
      const [, year, country, continent, population, gdp] = line.split(',');
      this.updateGroup('byYear', year, Number(population), Number(gdp));
      this.updateGroup('byCountry', country, Number(population), Number(gdp));
      this.updateGroup('byContinent', continent, Number(population), Number(gdp));
    });
  }

  private updateGroup(group: string, key: string, population: number, gdp: number) {
    if (!this.groupedData[group][key]) {
      this.groupedData[group][key] = { population: 0, gdp: 0 };
    }
    this.groupedData[group][key].population += population || 0;
    this.groupedData[group][key].gdp += gdp || 0;
  }

  updateChartData() {
    const currentGroup = `by${this.viewMode.charAt(0).toUpperCase()}${this.viewMode.slice(1)}`;
    const data = this.groupedData[currentGroup];
    const categories = Object.keys(data).sort();

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: { categories },
      series: [
        {
          name: 'Population',
          data: categories.map((key) => data[key].population)
        },
        {
          name: 'GDP (USD)',
          data: categories.map((key) => data[key].gdp)
        }
      ]
    };
  }
}
