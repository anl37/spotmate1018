export type LocationStatus = 'live' | 'paused' | 'denied' | 'error';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy: number;
  speed?: number;
  heading?: number;
}

export interface UserLocation extends LocationCoordinates {
  userId: string;
  geohash?: string;
  locationStatus: LocationStatus;
  updatedAt: Date;
}

export interface LocationStreamOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  distanceFilter?: number; // meters
  updateInterval?: number; // milliseconds
}

export interface LocationError {
  code: number;
  message: string;
}

export interface LocationContextValue {
  currentLocation: LocationCoordinates | null;
  locationStatus: LocationStatus;
  isTracking: boolean;
  error: LocationError | null;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  startHighAccuracySession: () => Promise<void>;
  stopHighAccuracySession: () => void;
  requestPermission: () => Promise<PermissionState>;
}
