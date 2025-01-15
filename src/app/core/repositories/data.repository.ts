import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
  private readonly API_URL = 'http://localhost:3000/api/data';

  constructor(private http: HttpClient) {}

  getCountryData(): Observable<CountryData[]> {
    return this.http.get(this.API_URL, { responseType: 'text' }).pipe(
      map((csv) => this.parseCSV(csv)),
      catchError(this.handleError)
    );
  }

  private parseCSV(csv: string): CountryData[] {
    return csv
      .split('\n')
      .slice(1)
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const [id, name, country, continent, population, gdp] = line.split(',').map((val) => val.trim());
        return {
          id,
          name,
          country,
          continent,
          population: parseInt(population, 10) || 0,
          gdp: parseFloat(gdp) || 0
        };
      })
      .filter((data) => data.country && (data.population > 0 || data.gdp > 0));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while fetching data';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
