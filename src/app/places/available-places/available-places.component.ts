import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  private closeSubscription(subscription: Subscription): void {
    if (subscription) {
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (resp) => this.places.set(resp),
      complete: () => this.isFetching.set(false),
      error: (err) => {
        this.isFetching.set(false);
        this.error.set(err);
      },
    });
    this.closeSubscription(subscription);
  }

  onSelectPlace(place: Place) {
    const subscription = this.placesService
      .addPlaceToUserPlaces(place.id)
      .subscribe((resp) => console.log(resp));
    this.closeSubscription(subscription);
  }
}
