import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MLModel {
  id: string;
  name: string;
  status: 'training' | 'deployed' | 'failed';
  accuracy: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MLService {
  private mockModels: MLModel[] = [
    {
      id: '1',
      name: 'GDP Predictor',
      status: 'deployed',
      accuracy: 0.89,
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Population Growth Model',
      status: 'training',
      accuracy: 0.75,
      lastUpdated: new Date()
    }
  ];

  getModels(): Observable<MLModel[]> {
    return of(this.mockModels);
  }

  trainModel(modelId: string): Observable<boolean> {
    console.log('Training model', modelId);
    return of(true);
  }

  deployModel(modelId: string): Observable<boolean> {
    console.log('Deploying model', modelId);
    return of(true);
  }
}
