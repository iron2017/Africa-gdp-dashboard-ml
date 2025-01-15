import { Injectable } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs';
import { AppState } from '../state/app.state';
import { CountryData } from '../repositories/data.repository';

export interface AnalyticsResult {
  highestGDP: { value: number; country: string };
  highestPopulation: { value: number; country: string };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  readonly analytics$ = this.appState.countryData$.pipe(
    tap((data) => console.log('Analytics received data:', data?.length)),
    map((data) => this.calculateMetrics(data || [])),
    tap((result) => console.log('Analytics calculated:', result)),
    shareReplay(1)
  );

  readonly highestGDP$ = this.analytics$.pipe(
    map((analytics) => analytics.highestGDP),
    shareReplay(1)
  );

  readonly highestPopulation$ = this.analytics$.pipe(
    map((analytics) => analytics.highestPopulation),
    shareReplay(1)
  );

  constructor(private appState: AppState) {}

  private calculateMetrics(data: CountryData[]): AnalyticsResult {
    if (!data.length) {
      return {
        highestGDP: { value: 0, country: 'No data' },
        highestPopulation: { value: 0, country: 'No data' }
      };
    }

    return data.reduce(
      (acc, curr) => ({
        highestGDP: !isNaN(curr.gdp) && curr.gdp > acc.highestGDP.value ? { value: curr.gdp, country: curr.country } : acc.highestGDP,
        highestPopulation:
          !isNaN(curr.population) && curr.population > acc.highestPopulation.value
            ? { value: curr.population, country: curr.country }
            : acc.highestPopulation
      }),
      {
        highestGDP: { value: 0, country: '' },
        highestPopulation: { value: 0, country: '' }
      }
    );
  }
}
