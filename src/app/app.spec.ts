import { PLACES_BY_UNIVERSITY, UNIVERSITIES } from './core/data/demo-data';

describe('demo data', () => {
  it('offers the University of Washington as the only MVP university', () => {
    expect(UNIVERSITIES.map((university) => university.name)).toEqual(['University of Washington']);
  });

  it('has two Seattle places with worship times, transit directions and tags', () => {
    const places = PLACES_BY_UNIVERSITY['university-of-washington'];

    expect(places.length).toBe(2);
    for (const place of places) {
      expect(place.worshipTimes.length).toBeGreaterThan(0);
      expect(place.busDirections.length).toBeGreaterThan(20);
      expect(place.tags.length).toBeGreaterThan(0);
      expect(place.website).toMatch(/^https:\/\//);
    }
  });
});
