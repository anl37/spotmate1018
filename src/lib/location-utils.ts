/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function metersBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    // Round to nearest 10m
    return `~${Math.round(meters / 10) * 10} m`;
  }
  // Round to 1 decimal for km
  return `~${(meters / 1000).toFixed(1)} km`;
}

/**
 * Mock user location (replace with actual geolocation in production)
 */
export function getMockUserLocation() {
  return {
    lat: 40.7580,
    lng: -73.9855,
    accuracy: 12
  };
}
