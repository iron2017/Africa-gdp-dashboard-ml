// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// project import

import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';

import { MapVisualizationComponent } from '../../theme/shared/components/map-visualization/map-visualization.component';

import { TableVisualizationComponent } from '../../theme/shared/components/table-visualization/table-visualization.component';
import { MLDashboardComponent } from '../../theme/shared/components/ml-dashboard/ml-dashboard.component';
import { DataRepository } from '../../core/repositories/data.repository';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AppState } from '../../core/state/app.state';
import { filter } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [CommonModule, NgbModule, BarChartComponent, MapVisualizationComponent, TableVisualizationComponent, MLDashboardComponent],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  readonly loading$ = this.appState.loading$;
  readonly error$ = this.appState.error$;
  readonly analytics$ = this.analyticsService.analytics$.pipe(tap((data) => console.log('Analytics Data:', data)));

  constructor(
    private dataRepository: DataRepository,
    private analyticsService: AnalyticsService,
    private appState: AppState
  ) {}

  ngOnInit(): void {
    this.appState.setLoading(true);

    this.dataRepository
      .getCountryData()
      .pipe(
        tap((data) => console.log('Raw Data:', data)),
        filter((data) => data.length > 0)
      )
      .subscribe({
        next: (data) => {
          console.log('Processing data:', data.length, 'records');
          this.appState.updateData(data);
        },
        error: (error) => {
          console.error('Data fetch error:', error);
          this.appState.setError(error.message);
        }
      });
  }
}
