import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';

import { PLACES_BY_UNIVERSITY, UNIVERSITIES } from '../../core/data/demo-data';
import type { Place, University } from '../../core/model/place';

const SEATTLE_CENTER: L.LatLngTuple = [47.6062, -122.3321];

@Component({
  selector: 'app-city-map',
  templateUrl: './city-map.html',
  styleUrl: './city-map.scss',
})
export class CityMap implements OnDestroy {
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('map');

  private map?: L.Map;
  private universityMarker?: L.CircleMarker;
  private readonly placeMarkers = new Map<string, L.CircleMarker>();

  protected readonly universities = UNIVERSITIES;
  protected readonly query = signal('');
  protected readonly suggestionsOpen = signal(false);
  protected readonly selectedUniversity = signal<University | null>(null);
  protected readonly selectedPlace = signal<Place | null>(null);

  protected readonly filteredUniversities = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return this.universities;
    }

    return this.universities.filter((university) =>
      `${university.name} ${university.city}`.toLowerCase().includes(term),
    );
  });

  protected readonly places = computed<readonly Place[]>(() => {
    const university = this.selectedUniversity();
    return university ? (PLACES_BY_UNIVERSITY[university.id] ?? []) : [];
  });

  constructor() {
    afterNextRender(() => this.initMap());
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  protected openSuggestions(): void {
    this.suggestionsOpen.set(true);
  }

  protected closeSuggestionsSoon(): void {
    window.setTimeout(() => this.suggestionsOpen.set(false), 120);
  }

  protected onQueryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
    this.suggestionsOpen.set(true);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.suggestionsOpen.set(true);
      return;
    }

    if (event.key === 'Enter') {
      const first = this.filteredUniversities()[0];
      if (first) {
        event.preventDefault();
        this.selectUniversity(first);
      }
      return;
    }

    if (event.key === 'Escape') {
      this.suggestionsOpen.set(false);
    }
  }

  protected selectUniversity(university: University): void {
    this.selectedUniversity.set(university);
    this.selectedPlace.set(null);
    this.query.set(university.name);
    this.suggestionsOpen.set(false);

    this.showPlaces(university);
  }

  protected selectPlace(place: Place): void {
    this.selectedPlace.set(place);
    this.paintMarkers();
    this.map?.flyTo(place.coordinates, 14, { duration: 0.6 });
  }

  protected closePlace(): void {
    this.selectedPlace.set(null);
    this.paintMarkers();
  }

  protected reset(): void {
    this.query.set('');
    this.suggestionsOpen.set(false);
    this.selectedUniversity.set(null);
    this.selectedPlace.set(null);

    this.removeMarkers();
    this.map?.setView(SEATTLE_CENTER, 11);
  }

  protected mapsUrl(place: Place): string {
    const [lat, lng] = place.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  private initMap(): void {
    if (this.map) {
      return;
    }

    this.map = L.map(this.mapContainer().nativeElement, {
      center: SEATTLE_CENTER,
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    L.control.attribution({ position: 'topright', prefix: false }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  private showPlaces(university: University): void {
    const map = this.map;
    if (!map) {
      return;
    }

    this.removeMarkers();

    this.universityMarker = L.circleMarker(university.coordinates, {
      radius: 7,
      color: '#1d4ed8',
      weight: 2,
      fillColor: '#3b82f6',
      fillOpacity: 1,
    })
      .bindTooltip(university.name, { direction: 'top', offset: [0, -8] })
      .addTo(map);

    for (const place of this.places()) {
      const marker = L.circleMarker(place.coordinates, {
        radius: 9,
        color: '#0f766e',
        weight: 2,
        fillColor: '#14b8a6',
        fillOpacity: 0.92,
      })
        .bindTooltip(place.name, { direction: 'top', offset: [0, -8] })
        .on('click', () => this.selectPlace(place))
        .addTo(map);

      this.placeMarkers.set(place.id, marker);
    }

    const bounds = L.latLngBounds([
      university.coordinates,
      ...this.places().map((place) => place.coordinates),
    ]);
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 13 });
  }

  private paintMarkers(): void {
    const selectedId = this.selectedPlace()?.id;

    for (const [id, marker] of this.placeMarkers) {
      const isSelected = id === selectedId;
      marker.setStyle({
        radius: isSelected ? 12 : 9,
        color: isSelected ? '#0f172a' : '#0f766e',
        weight: isSelected ? 3 : 2,
        fillColor: isSelected ? '#f59e0b' : '#14b8a6',
      });
      marker.setRadius(isSelected ? 12 : 9);
      if (isSelected) {
        marker.bringToFront();
      }
    }
  }

  private removeMarkers(): void {
    for (const marker of this.placeMarkers.values()) {
      marker.remove();
    }
    this.placeMarkers.clear();
    this.universityMarker?.remove();
    this.universityMarker = undefined;
  }
}
