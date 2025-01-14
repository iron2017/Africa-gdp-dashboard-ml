import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MLService, MLModel } from '../../services/ml.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ml-dashboard',
  standalone: true,
  imports: [CommonModule, NgbModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5>Machine Learning Models</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Status</th>
                <th>Accuracy</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let model of models">
                <td>{{ model.name }}</td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="{
                      'bg-success': model.status === 'deployed',
                      'bg-warning': model.status === 'training',
                      'bg-danger': model.status === 'failed'
                    }"
                  >
                    {{ model.status }}
                  </span>
                </td>
                <td>{{ model.accuracy | percent }}</td>
                <td>{{ model.lastUpdated | date: 'short' }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-2" (click)="trainModel(model.id)" [disabled]="model.status === 'training'">
                    Train
                  </button>
                  <button class="btn btn-sm btn-success" (click)="deployModel(model.id)" [disabled]="model.status !== 'training'">
                    Deploy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class MLDashboardComponent implements OnInit {
  models: MLModel[] = [];

  constructor(private mlService: MLService) {}

  ngOnInit() {
    this.mlService.getModels().subscribe((models) => {
      this.models = models;
    });
  }

  trainModel(modelId: string) {
    this.mlService.trainModel(modelId).subscribe();
  }

  deployModel(modelId: string) {
    this.mlService.deployModel(modelId).subscribe();
  }
}
