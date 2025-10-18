import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LocationContextValue, LocationStreamOptions } from './types';
import { useLocationStream } from './useLocationStream';
import { requestPermission, checkPermission } from './permissions';

const LocationContext = createContext<LocationContextValue | null>(null);

const NORMAL_OPTIONS: LocationStreamOptions = {
  enableHighAccuracy: true,
  distanceFilter: 25, // meters
  updateInterval: 10000, // 10 seconds
  timeout: 10000
};

const HIGH_ACCURACY_OPTIONS: LocationStreamOptions = {
  enableHighAccuracy: true,
  distanceFilter: 10, // meters
  updateInterval: 5000, // 5 seconds
  timeout: 10000
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<LocationStreamOptions>(NORMAL_OPTIONS);
  const [isHighAccuracySession, setIsHighAccuracySession] = useState(false);
  
  const {
    currentLocation,
    error,
    isTracking,
    locationStatus,
    startTracking: startStream,
    stopTracking: stopStream
  } = useLocationStream(options);

  const startTracking = useCallback(async () => {
    const permission = await checkPermission();
    if (permission === 'denied') {
      return;
    }
    await startStream();
  }, [startStream]);

  const stopTracking = useCallback(() => {
    stopStream();
    setIsHighAccuracySession(false);
    setOptions(NORMAL_OPTIONS);
  }, [stopStream]);

  const startHighAccuracySession = useCallback(async () => {
    setIsHighAccuracySession(true);
    setOptions(HIGH_ACCURACY_OPTIONS);
    
    if (!isTracking) {
      await startStream();
    }
  }, [isTracking, startStream]);

  const stopHighAccuracySession = useCallback(() => {
    setIsHighAccuracySession(false);
    setOptions(NORMAL_OPTIONS);
  }, []);

  const contextValue: LocationContextValue = {
    currentLocation,
    locationStatus,
    isTracking,
    error,
    startTracking,
    stopTracking,
    startHighAccuracySession,
    stopHighAccuracySession,
    requestPermission
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
