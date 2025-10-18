import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationCoordinates, LocationError, LocationStreamOptions, LocationStatus } from './types';
import { getGeolocationError, isGeolocationSupported } from './permissions';
import { locationWriter } from './supabaseWriter';
import { calculateDistance } from './geoutils';

const DEFAULT_OPTIONS: LocationStreamOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
  distanceFilter: 25, // meters
  updateInterval: 10000 // 10 seconds
};

export function useLocationStream(options: LocationStreamOptions = DEFAULT_OPTIONS) {
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('paused');
  
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastLocationRef = useRef<LocationCoordinates | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLocationStatus('paused');
    locationWriter.updateStatus('paused');
  }, []);

  const handlePosition = useCallback((position: GeolocationPosition) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    const currentOpts = optionsRef.current;

    const newCoords: LocationCoordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined
    };

    // Apply distance filter
    let shouldUpdate = !lastLocationRef.current;
    
    if (lastLocationRef.current && currentOpts.distanceFilter) {
      const distance = calculateDistance(
        lastLocationRef.current.lat,
        lastLocationRef.current.lng,
        newCoords.lat,
        newCoords.lng
      );
      shouldUpdate = distance >= currentOpts.distanceFilter;
    }

    // Apply time-based update interval
    if (currentOpts.updateInterval) {
      shouldUpdate = shouldUpdate || timeSinceLastUpdate >= currentOpts.updateInterval;
    }

    if (shouldUpdate) {
      setCurrentLocation(newCoords);
      setError(null);
      lastLocationRef.current = newCoords;
      lastUpdateTimeRef.current = now;
      
      // Write to database
      locationWriter.updateLocation(newCoords, 'live');
    }
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    const locationError = getGeolocationError(err);
    setError(locationError);
    setLocationStatus('error');
    locationWriter.updateStatus('error');
    console.error('Geolocation error:', locationError);
  }, []);

  const startTracking = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setError({
        code: -1,
        message: 'Geolocation is not supported by your browser'
      });
      return;
    }

    if (watchIdRef.current !== null) {
      return; // Already tracking
    }

    setIsTracking(true);
    setLocationStatus('live');
    setError(null);

    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: optionsRef.current.enableHighAccuracy ?? true,
      maximumAge: optionsRef.current.maximumAge ?? 0,
      timeout: optionsRef.current.timeout ?? 10000
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      geolocationOptions
    );
  }, [handlePosition, handleError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    currentLocation,
    error,
    isTracking,
    locationStatus,
    startTracking,
    stopTracking
  };
}
