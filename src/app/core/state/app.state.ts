import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, shareReplay } from 'rxjs';
import { CountryData } from '../repositories/data.repository';

export interface AppStateModel {
  countryData: CountryData[];
  loading: boolean;
  error: string | null;
}

const initialState: AppStateModel = {
  countryData: [],
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class AppState {
  private state = new BehaviorSubject<AppStateModel>(initialState);
  private state$ = this.state.asObservable();

  readonly countryData$ = this.state$.pipe(
    map((state) => state.countryData),
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly loading$ = this.state$.pipe(
    map((state) => state.loading),
    distinctUntilChanged()
  );

  readonly error$ = this.state$.pipe(
    map((state) => state.error),
    distinctUntilChanged()
  );

  updateData(data: CountryData[]) {
    this.state.next({
      ...this.state.value,
      countryData: data,
      loading: false,
      error: null
    });
  }

  setLoading(loading: boolean) {
    this.state.next({ ...this.state.value, loading });
  }

  setError(error: string) {
    this.state.next({ ...this.state.value, error, loading: false });
  }
}
