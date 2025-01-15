import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CountryData } from '../repositories/data.repository';

export interface AnalyticsResult {
  highestGDP: { value: number; country: string };
  highestPopulation: { value: number; country: string };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private analyticsSubject = new BehaviorSubject<AnalyticsResult>({
    highestGDP: { value: 0, country: '' },
    highestPopulation: { value: 0, country: '' }
  });

  calculateMetrics(data: CountryData[]): void {
    const result = data.reduce(
      (acc, curr) => ({
        highestGDP: curr.gdp > acc.highestGDP.value ? { value: curr.gdp, country: curr.country } : acc.highestGDP,
        highestPopulation:
          curr.population > acc.highestPopulation.value ? { value: curr.population, country: curr.country } : acc.highestPopulation
      }),
      {
        highestGDP: { value: 0, country: '' },
        highestPopulation: { value: 0, country: '' }
      }
    );

    this.analyticsSubject.next(result);
  }

  getAnalytics(): Observable<AnalyticsResult> {
    return this.analyticsSubject.asObservable();
  }
}
