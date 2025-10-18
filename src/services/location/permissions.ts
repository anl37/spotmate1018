import { LocationError } from './types';

export async function checkPermission(): Promise<PermissionState> {
  if (!('permissions' in navigator)) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return result.state;
  } catch (error) {
    console.warn('Permission API not fully supported:', error);
    return 'prompt';
  }
}

export async function requestPermission(): Promise<PermissionState> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve('denied');
      return;
    }

    // Trigger permission request by attempting to get position
    navigator.geolocation.getCurrentPosition(
      () => {
        resolve('granted');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve('denied');
        } else {
          resolve('prompt');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

export function getPermissionError(permissionState: PermissionState): LocationError | null {
  if (permissionState === 'denied') {
    return {
      code: 1,
      message: 'Location permission denied. Please enable location access in your browser settings.'
    };
  }
  return null;
}

export function openLocationSettings(): void {
  // Browser-specific: Most browsers don't allow direct navigation to settings
  // Users must manually go to browser settings
  alert(
    'To enable location access:\n\n' +
    '1. Click the lock icon in your browser address bar\n' +
    '2. Find "Location" permissions\n' +
    '3. Set it to "Allow"\n' +
    '4. Refresh the page'
  );
}

export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

export function getGeolocationError(error: GeolocationPositionError): LocationError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        code: error.PERMISSION_DENIED,
        message: 'Location permission denied'
      };
    case error.POSITION_UNAVAILABLE:
      return {
        code: error.POSITION_UNAVAILABLE,
        message: 'Location information unavailable'
      };
    case error.TIMEOUT:
      return {
        code: error.TIMEOUT,
        message: 'Location request timed out'
      };
    default:
      return {
        code: -1,
        message: 'An unknown error occurred'
      };
  }
}
