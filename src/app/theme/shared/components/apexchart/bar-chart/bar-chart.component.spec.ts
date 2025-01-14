import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BarChartComponent } from './bar-chart.component';
import { ChartDataService } from '../../../services/chart-data.service';
import { of } from 'rxjs';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let chartDataService: ChartDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BarChartComponent],
      providers: [ChartDataService]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    chartDataService = TestBed.inject(ChartDataService);

    spyOn(chartDataService, 'getChartData').and.returnValue(of('Year,Country\n2022,Uganda'));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getChartData on init and update chart data', () => {
    expect(chartDataService.getChartData).toHaveBeenCalled();
    // ...existing code...
  });

  it('should switch chart data when viewMode changes', () => {
    component.viewMode = 'year';
    component.updateChartData();

    expect(component.chartOptions.xaxis.categories).toContain('2022');
    expect(component.chartOptions.series?.length).toBeGreaterThan(0);
  });
});
