import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
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
    const subscription = this.placesService.loadUserPlaces().subscribe({
      next: (resp) => this.places.set(resp),
      complete: () => this.isFetching.set(false),
      error: (err) => {
        this.isFetching.set(false);
        this.error.set(err);
      },
    });
    this.closeSubscription(subscription);
  }
}
