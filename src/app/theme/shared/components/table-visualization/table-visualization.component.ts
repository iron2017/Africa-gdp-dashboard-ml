import { Component, OnInit } from '@angular/core';
import { ChartDataService } from '../../services/chart-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Record {
  year: string;
  country: string;
  population: string;
  gdp: string;
}
@Component({
  selector: 'app-table-visualization',
  templateUrl: './table-visualization.component.html',
  styleUrls: ['./table-visualization.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class TableVisualizationComponent implements OnInit {
  records: Record[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  yearFilter = '';
  countryFilter = '';
  countries: string[] = []; // Added countries array
  years: number[] = []; // Added years array

  constructor(private chartDataService: ChartDataService) {}

  ngOnInit(): void {
    this.chartDataService.getChartData().subscribe((csvData) => {
      const rows = csvData.split('\n').slice(1);
      this.records = rows
        .map((row) => {
          const [id, year, country, , population, gdp] = row.split(',');
          return { id, year, country, population, gdp };
        })
        .filter((record) => record.country);

      // Populate unique countries
      this.countries = Array.from(new Set(this.records.map((record) => record.country))).sort();

      // Populate years from 2000 to 2022
      this.years = Array.from({ length: 23 }, (_, i) => 2000 + i);
    });
  }

  get filteredRecords() {
    return this.records.filter(
      (rec) =>
        (this.yearFilter ? rec.year === this.yearFilter.toString() : true) &&
        (this.countryFilter ? rec.country === this.countryFilter : true)
    );
  }

  get displayedRecords() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRecords.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get maxPage() {
    return Math.ceil(this.filteredRecords.length / this.itemsPerPage) || 1; // Updated to use filteredRecords
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }
}
