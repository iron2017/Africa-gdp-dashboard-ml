import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface CountryData {
  id: string;
  name: string;
  country: string;
  continent: string;
  population: number;
  gdp: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataRepository {
  constructor(private http: HttpClient) {}

  getCountryData(): Observable<CountryData[]> {
    return this.http.get('assets/data/countries.csv', { responseType: 'text' }).pipe(map((csv) => this.parseCSV(csv)));
  }

  private parseCSV(csv: string): CountryData[] {
    return csv
      .split('\n')
      .slice(1)
      .map((line) => {
        const [id, name, country, continent, population, gdp] = line.split(',');
        return {
          id,
          name,
          country,
          continent,
          population: parseInt(population, 10),
          gdp: parseFloat(gdp) || 0
        };
      });
  }
}
