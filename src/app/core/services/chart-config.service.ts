import { Injectable } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigService {
  getBaseConfig(): Partial<ApexOptions> {
    return {
      dataLabels: { enabled: false },
      chart: {
        type: 'line',
        height: 480,
        toolbar: { show: true },
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
      tooltip: { theme: 'light' }
    };
  }
}
