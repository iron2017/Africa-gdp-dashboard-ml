export interface ChartData {
  population: number;
  gdp: number;
}

export interface GroupedData {
  byYear: Record<string, ChartData>;
  byCountry: Record<string, ChartData>;
  byContinent: Record<string, ChartData>;
}

export type ViewMode = 'year' | 'country' | 'continent' | 'map';
