// Angular Import
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import

import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';

import { MapVisualizationComponent } from '../../theme/shared/components/map-visualization/map-visualization.component';

import { TableVisualizationComponent } from '../../theme/shared/components/table-visualization/table-visualization.component';
import { MLDashboardComponent } from '../../theme/shared/components/ml-dashboard/ml-dashboard.component';
import { DataRepository } from '../../core/repositories/data.repository';
import { AnalyticsService, AnalyticsResult } from '../../core/services/analytics.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-default',
  imports: [CommonModule, BarChartComponent, MapVisualizationComponent, TableVisualizationComponent, MLDashboardComponent],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  analytics: AnalyticsResult = {
    highestGDP: { value: 0, country: '' },
    highestPopulation: { value: 0, country: '' }
  };

  constructor(
    private dataRepository: DataRepository,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.dataRepository
      .getCountryData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.analyticsService.calculateMetrics(data);
      });

    this.analyticsService
      .getAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((analytics) => {
        this.analytics = analytics;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
