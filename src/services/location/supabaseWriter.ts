import { supabase } from '@/integrations/supabase/client';
import { LocationCoordinates, LocationStatus } from './types';
import { encodeGeohash, calculateDistance } from './geoutils';

interface WriteQueueItem {
  coords: LocationCoordinates;
  status: LocationStatus;
  timestamp: number;
}

class LocationWriter {
  private lastWrittenCoords: LocationCoordinates | null = null;
  private lastWriteTime: number = 0;
  private writeQueue: WriteQueueItem | null = null;
  private writeTimer: number | null = null;
  private isWriting: boolean = false;

  // Throttle settings
  private readonly MIN_WRITE_INTERVAL = 10000; // 10 seconds
  private readonly MIN_DISTANCE_METERS = 25; // 25 meters
  private readonly MAX_WRITE_INTERVAL = 60000; // 60 seconds

  async updateLocation(coords: LocationCoordinates, status: LocationStatus): Promise<void> {
    const now = Date.now();
    const timeSinceLastWrite = now - this.lastWriteTime;
    const shouldWriteByTime = timeSinceLastWrite >= this.MIN_WRITE_INTERVAL;

    // Calculate distance from last written position
    let shouldWriteByDistance = false;
    if (this.lastWrittenCoords) {
      const distance = calculateDistance(
        this.lastWrittenCoords.lat,
        this.lastWrittenCoords.lng,
        coords.lat,
        coords.lng
      );
      shouldWriteByDistance = distance >= this.MIN_DISTANCE_METERS;
    }

    // Force write if too much time has passed
    const forceWrite = timeSinceLastWrite >= this.MAX_WRITE_INTERVAL;

    // Queue the update
    this.writeQueue = { coords, status, timestamp: now };

    // Write immediately if conditions are met
    if (!this.lastWrittenCoords || shouldWriteByTime || shouldWriteByDistance || forceWrite) {
      await this.flush();
    } else {
      // Schedule a delayed write
      this.scheduleWrite();
    }
  }

  async updateStatus(status: LocationStatus): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_locations')
        .update({ 
          location_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to update location status:', error);
      }
    } catch (error) {
      console.error('Error updating location status:', error);
    }
  }

  private scheduleWrite(): void {
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    const now = Date.now();
    const timeSinceLastWrite = now - this.lastWriteTime;
    const timeUntilNextWrite = Math.max(
      this.MIN_WRITE_INTERVAL - timeSinceLastWrite,
      1000
    );

    this.writeTimer = window.setTimeout(() => {
      this.flush();
    }, timeUntilNextWrite);
  }

  private async flush(): Promise<void> {
    if (this.isWriting || !this.writeQueue) return;

    this.isWriting = true;
    const item = this.writeQueue;
    this.writeQueue = null;

    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
      this.writeTimer = null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const geohash = encodeGeohash(item.coords.lat, item.coords.lng);
      
      const locationData = {
        user_id: user.id,
        lat: item.coords.lat,
        lng: item.coords.lng,
        accuracy: item.coords.accuracy,
        speed: item.coords.speed || null,
        heading: item.coords.heading || null,
        geohash,
        location_status: item.status,
        updated_at: new Date().toISOString()
      };

      // Use upsert to insert or update
      const { error } = await supabase
        .from('user_locations')
        .upsert(locationData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Failed to write location to database:', error);
      } else {
        this.lastWrittenCoords = item.coords;
        this.lastWriteTime = item.timestamp;
      }
    } catch (error) {
      console.error('Error writing location:', error);
    } finally {
      this.isWriting = false;
    }
  }

  async clearLocation(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_locations')
        .delete()
        .eq('user_id', user.id);

      this.lastWrittenCoords = null;
      this.lastWriteTime = 0;
      this.writeQueue = null;
    } catch (error) {
      console.error('Error clearing location:', error);
    }
  }
}

export const locationWriter = new LocationWriter();
