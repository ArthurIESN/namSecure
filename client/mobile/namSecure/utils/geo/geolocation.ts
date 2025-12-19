/**
 * Utilities for geolocation calculations
 */

/**
 * Converts degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Calculates the distance between two geographic points in meters
 * using the Haversine formula
 *
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_METERS = 6371e3;

  const phi1 = degreesToRadians(lat1);
  const phi2 = degreesToRadians(lat2);
  const deltaPhi = degreesToRadians(lat2 - lat1);
  const deltaLambda = degreesToRadians(lon2 - lon1);

  const haversineA =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

  return EARTH_RADIUS_METERS * centralAngle;
}

/**
 * Checks if two positions are close to each other
 * @param pos1 First position with latitude and longitude
 * @param pos2 Second position with latitude and longitude
 * @param thresholdMeters Maximum distance in meters to be considered close (default: 10)
 * @returns True if positions are within threshold distance
 */
export function arePositionsClose(
  pos1: { latitude: number; longitude: number },
  pos2: { latitude: number; longitude: number },
  thresholdMeters: number = 10
): boolean {
  return calculateDistance(
    pos1.latitude,
    pos1.longitude,
    pos2.latitude,
    pos2.longitude
  ) <= thresholdMeters;
}