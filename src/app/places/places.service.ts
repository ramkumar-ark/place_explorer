import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private baseUrl = 'http://localhost:3000/';
  private httpClient = inject(HttpClient);
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'places',
      'Some thing went wrong fetching available places. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'user-places',
      'Some thing went wrong fetching your places. Please try again later.'
    );
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put(this.baseUrl + 'user-places', { placeId });
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
