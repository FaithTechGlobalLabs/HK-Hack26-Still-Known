import type { LatLngTuple } from 'leaflet';

/** A university the student can search for. One option for the MVP. */
export interface University {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly coordinates: LatLngTuple;
}

/** A worship service shown on a place card. */
export interface WorshipTime {
  readonly label: string;
  readonly time: string;
}

/** A hard-coded place shown on the map. */
export interface Place {
  readonly id: string;
  readonly name: string;
  readonly type: 'Church' | 'Campus ministry';
  readonly address: string;
  readonly coordinates: LatLngTuple;
  readonly tradition: string;
  readonly description: string;
  readonly worshipTimes: readonly WorshipTime[];
  readonly busDirections: string;
  readonly tags: readonly string[];
  readonly website: string;
  readonly lastVerified: string;
}
