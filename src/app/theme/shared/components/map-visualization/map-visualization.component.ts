import { Component, OnInit } from '@angular/core';
import { data } from '../apexchart/data';
import { topology } from '../apexchart/topology';
import { AgCharts } from 'ag-charts-angular';
import 'ag-charts-enterprise';
@Component({
  selector: 'app-map-visualization',
  templateUrl: './map-visualization.component.html',
  styleUrls: ['./map-visualization.component.scss'],
  imports: [AgCharts]
})
export class MapVisualizationComponent implements OnInit {
  public options;

  constructor() {
    this.options = {
      data,
      topology,

      series: [
        {
          type: 'map-shape-background'
        },
        {
          type: 'map-shape',
          title: 'GDP per Capita',
          idKey: 'name',
          colorKey: 'value',
          colorName: 'GDP (USD)'
        }
      ],
      gradientLegend: {
        enabled: true,
        position: 'right',
        gradient: {
          preferredLength: 200,
          thickness: 2
        },
        scale: {
          label: {
            fontSize: 10,
            formatter: (p) => '$' + p.value
          }
        }
      }
    };
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
