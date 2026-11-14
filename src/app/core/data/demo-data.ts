import type { Place, University } from '../model/place';

/**
 * Hard-coded demo data for the first MVP.
 *
 * Coordinates come from OpenStreetMap. Service times were checked against the
 * churches' public websites on 14 Nov 2026, but this is still demo data: the UI
 * tells the student to confirm before visiting.
 */
export const UNIVERSITIES: readonly University[] = [
  {
    id: 'university-of-washington',
    name: 'University of Washington',
    city: 'Seattle, WA',
    coordinates: [47.6554303, -122.3001692],
  },
];

export const PLACES_BY_UNIVERSITY: Readonly<Record<string, readonly Place[]>> = {
  'university-of-washington': [
    {
      id: 'evangelical-chinese-church-seattle',
      name: 'Evangelical Chinese Church of Seattle',
      type: 'Church',
      address: '651 NW 81st St, Seattle, WA 98117',
      coordinates: [47.6874572, -122.3656861],
      tradition: 'Evangelical · Cantonese, Mandarin and English congregations',
      description:
        'A large Chinese church north of Green Lake with English, Cantonese and Mandarin services, a youth ministry and a long-running young-adult community.',
      worshipTimes: [
        { label: 'English', time: 'Sunday · 9:15 am' },
        { label: 'Cantonese', time: 'Sunday · 9:30 am' },
        { label: 'Mandarin', time: 'Sunday · 11:00 am' },
        { label: 'Youth', time: 'Sunday · 9:15 am' },
      ],
      busDirections:
        'Ride Metro Route 45 north from the U District and get off near N 80th St. The church is just off N 80th at 651 NW 81st St — roughly 25–30 minutes from campus.',
      tags: ['Cantonese', 'Mandarin', 'English', 'Young adults', 'Youth ministry', 'Bus 45'],
      website: 'https://eccseattle.org/en/seattle-campus/',
      lastVerified: '14 Nov 2026',
    },
    {
      id: 'seattle-chinese-alliance-church',
      name: 'Seattle Chinese Alliance Church',
      type: 'Church',
      address: '2803 S Orcas St, Seattle, WA 98108',
      coordinates: [47.5505513, -122.2960209],
      tradition: 'Christian & Missionary Alliance · English, Cantonese and Mandarin',
      description:
        'A Beacon Hill church with three language congregations, a student and young-adult fellowship, and a straightforward trip from campus on the light rail.',
      worshipTimes: [
        { label: 'English', time: 'Sunday · 10:00 am' },
        { label: 'Cantonese', time: 'Sunday · 11:30 am' },
        { label: 'Mandarin', time: 'Sunday · 11:30 am' },
      ],
      busDirections:
        'Take the 1 Line south to Beacon Hill Station, then Metro Route 36 along Beacon Ave S to S Orcas St. The church is a short walk east at 2803 S Orcas St.',
      tags: ['Cantonese', 'Mandarin', 'English', '1 Line', 'Bus 36', 'Student fellowship'],
      website: 'https://www.scacseattle.org/visit-us/',
      lastVerified: '14 Nov 2026',
    },
  ],
};
