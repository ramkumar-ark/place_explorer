import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private userPlacesError = signal<string | null>(null);
  private userPlacesLoading = signal<boolean>(false);
  private baseUrl = 'http://localhost:3000/';
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  loadedUserPlaces = this.userPlaces.asReadonly();
  userPlacesError$ = this.userPlacesError.asReadonly();
  userPlacesLoading$ = this.userPlacesLoading.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'places',
      'Some thing went wrong fetching available places. Please try again later.'
    );
  }

  loadUserPlaces() {
    this.userPlacesLoading.set(true);
    const subscription = this.fetchPlaces(
      'user-places',
      'Some thing went wrong fetching your places. Please try again later.'
    ).subscribe({
      next: (places) => {
        this.userPlaces.set(places);
      },
      error: (err) => {
        this.userPlacesLoading.set(false);
        this.userPlacesError.set(err);
      },
      complete: () => {
        this.userPlacesLoading.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put(this.baseUrl + 'user-places', { placeId }).pipe(
      tap({
        next: () => {
          this.loadUserPlaces();
        },
      })
    );
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(api_endpoint: string, errorMessage: string) {
    return this.httpClient
      .get<{ places: Place[] }>(this.baseUrl + api_endpoint)
      .pipe(
        map((resp) => resp.places),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
