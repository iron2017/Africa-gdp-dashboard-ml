import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { ChartConfigService } from '../../../../../core/services/chart-config.service';
import { ChartDataTransformerService } from '../../../../../core/services/chart-data-transformer.service';
import { ChartDataService } from '../../../services/chart-data.service';
import { GroupedData, ViewMode } from '../../../../../core/models/chart.model';
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
export class BarChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  private destroy$ = new Subject<void>();
  chartOptions: Partial<ApexOptions>;
  viewMode: ViewMode = 'country';
  private groupedData!: GroupedData;

  constructor(
    private chartDataService: ChartDataService,
    private configService: ChartConfigService,
    private transformer: ChartDataTransformerService
  ) {
    this.chartOptions = this.configService.getBaseConfig();
  }

  ngOnInit() {
    this.chartDataService
      .getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((csvData) => {
        this.groupedData = this.transformer.transformData(csvData);
        this.updateChartData();
      });
  }

  updateChartData() {
    const data = this.groupedData[`by${this.viewMode.charAt(0).toUpperCase()}${this.viewMode.slice(1)}`];
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
