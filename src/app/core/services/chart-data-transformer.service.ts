import { Injectable } from '@angular/core';
import { GroupedData, ChartData } from '../models/chart.model';

@Injectable({
  providedIn: 'root'
})
export class ChartDataTransformerService {
  transformData(csvData: string): GroupedData {
    const [, ...lines] = csvData.split('\n');
    const allRows = lines.map((line) => line.split(',')).filter((cells) => cells.length > 1);

    const result: GroupedData = {
      byYear: {},
      byCountry: {},
      byContinent: {}
    };

    allRows.forEach((cells) => {
      const [, year, country, continent, population, gdp] = cells;
      this.updateGroup(result.byYear, year, Number(population), Number(gdp));
      this.updateGroup(result.byCountry, country, Number(population), Number(gdp));
      this.updateGroup(result.byContinent, continent, Number(population), Number(gdp));
    });

    return result;
  }

  private updateGroup(group: Record<string, ChartData>, key: string, population: number, gdp: number) {
    if (!group[key]) {
      group[key] = { population: 0, gdp: 0 };
    }
    group[key].population += population || 0;
    group[key].gdp += gdp || 0;
  }
}
