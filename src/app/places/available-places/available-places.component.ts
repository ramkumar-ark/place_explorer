import { Component, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  error = signal<string | null>(null);
  private httpClient = inject(HttpClient);
  ngOnInit() {
    this.isFetching.set(true);
    this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .subscribe({
        next: (resp) => this.places.set(resp.places),
        complete: () => this.isFetching.set(false),
        error: (err) => {
          this.isFetching.set(false);
          console.error(err);
          this.error.set(
            'Some thing went wrong fetching available places. Please try again later.'
          );
        },
      });
  }
}
