// angular import
import { Component, ViewChild, OnInit } from '@angular/core';

// third party
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { ChartDataService } from '../../../services/chart-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bar-chart',
  imports: [NgApexchartsModule, FormsModule],
  providers: [ChartDataService],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ApexOptions>;
  viewMode: 'year' | 'country' | 'continent' | 'map' = 'country';
  allData: {
    byYear: Record<string, { population: number; gdp: number }>;
    byCountry: Record<string, { population: number; gdp: number }>;
    byContinent: Record<string, { population: number; gdp: number }>;
  } = { byYear: {}, byCountry: {}, byContinent: {} };

  // Constructor
  constructor(private chartDataService: ChartDataService) {
    this.chartOptions = {
      series: [
        {
          name: 'Investment',
          data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
        },
        {
          name: 'Loss',
          data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
        },
        {
          name: 'Profit',
          data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
        },
        {
          name: 'Maintenance',
          data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
        }
      ],
      dataLabels: {
        enabled: false
      },
      chart: {
        type: 'line',
        height: 480,
        toolbar: {
          show: true
        },
        background: 'transparent'
      },
      colors: ['#d3eafd', '#2196f3', '#673ab7', '#ede7f6'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      tooltip: {
        theme: 'light'
      }
    };
  }

  ngOnInit() {
    this.chartDataService.getChartData().subscribe((csvData) => {
      const [, ...lines] = csvData.split('\n');
      const allRows = lines.map((line) => line.split(',')).filter((cells) => cells.length > 1);

      // Group by Year
      const byYear: Record<string, { population: number; gdp: number }> = {};
      // Group by Country
      const byCountry: Record<string, { population: number; gdp: number }> = {};
      // Group by Continent
      const byContinent: Record<string, { population: number; gdp: number }> = {};

      allRows.forEach((cells) => {
        const year = cells[1];
        const country = cells[2];
        const continent = cells[3];
        const population = parseInt(cells[4], 10) || 0;
        const gdp = parseFloat(cells[5]) || 0;

        // Populate byYear
        if (!byYear[year]) byYear[year] = { population: 0, gdp: 0 };
        byYear[year].population += population;
        byYear[year].gdp += gdp;

        // Populate byCountry
        if (!byCountry[country]) byCountry[country] = { population: 0, gdp: 0 };
        byCountry[country].population += population;
        byCountry[country].gdp += gdp;

        // Populate byContinent
        if (!byContinent[continent]) byContinent[continent] = { population: 0, gdp: 0 };
        byContinent[continent].population += population;
        byContinent[continent].gdp += gdp;
      });

      // Store data for later use
      this.allData = { byYear, byCountry, byContinent };
      this.updateChartData();
    });
  }

  updateChartData() {
    if (this.viewMode === 'year') {
      const years = Object.keys(this.allData.byYear).sort();
      this.chartOptions.xaxis = { ...this.chartOptions.xaxis, categories: years };
      this.chartOptions.series = [
        { name: 'Population', data: years.map((y) => this.allData.byYear[y].population) },
        { name: 'GDP (USD)', data: years.map((y) => this.allData.byYear[y].gdp) }
      ];
    } else if (this.viewMode === 'country') {
      const countries = Object.keys(this.allData.byCountry).sort();
      this.chartOptions.xaxis = { ...this.chartOptions.xaxis, categories: countries };
      this.chartOptions.series = [
        { name: 'Population', data: countries.map((c) => this.allData.byCountry[c].population) },
        { name: 'GDP (USD)', data: countries.map((c) => this.allData.byCountry[c].gdp) }
      ];
    } else if (this.viewMode === 'continent') {
      const continents = Object.keys(this.allData.byContinent).sort();
      this.chartOptions.xaxis = { ...this.chartOptions.xaxis, categories: continents };
      this.chartOptions.series = [
        { name: 'Population', data: continents.map((ct) => this.allData.byContinent[ct].population) },
        { name: 'GDP (USD)', data: continents.map((ct) => this.allData.byContinent[ct].gdp) }
      ];
    } else if (this.viewMode === 'map') {
      // ...existing code for map mode...
    }
  }
}
