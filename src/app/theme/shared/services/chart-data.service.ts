import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  constructor(private http: HttpClient) {}

  getChartData(): Observable<string> {
    // Ensure the CSV includes latitude and longitude columns
    return this.http.get('http://localhost:3000/api/data', { responseType: 'text' });
  }
}
