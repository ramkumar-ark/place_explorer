import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private placesService = inject(PlacesService);
  places = this.placesService.loadedUserPlaces;
  error = this.placesService.userPlacesError$;
  isFetching = this.placesService.userPlacesLoading$;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.placesService.loadUserPlaces();
  }

  onRemovePlace(place: Place) {
    const subscription = this.placesService
      .removeUserPlace(place.id)
      .subscribe({
        error: (err) => alert(err),
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
