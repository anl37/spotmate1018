import { MapPin, MapPinOff, AlertCircle } from 'lucide-react';
import { useLocation } from '@/services/location/LocationProvider';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useState } from 'react';
import { openLocationSettings } from '@/services/location/permissions';

export function LiveLocationPill() {
  const { locationStatus, isTracking, startTracking, stopTracking, error, requestPermission } = useLocation();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const handleToggle = async () => {
    if (isTracking) {
      stopTracking();
    } else {
      const permission = await requestPermission();
      if (permission === 'denied') {
        setShowPermissionDialog(true);
      } else {
        await startTracking();
      }
    }
  };

  const getStatusConfig = () => {
    if (error || locationStatus === 'error') {
      return {
        icon: AlertCircle,
        text: 'Error',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
        dotClassName: 'bg-destructive'
      };
    }

    if (locationStatus === 'denied') {
      return {
        icon: MapPinOff,
        text: 'No permission',
        className: 'bg-muted text-muted-foreground border-border',
        dotClassName: 'bg-muted-foreground'
      };
    }

    if (locationStatus === 'live' && isTracking) {
      return {
        icon: MapPin,
        text: 'Live',
        className: 'bg-success/10 text-success border-success/20',
        dotClassName: 'bg-success animate-pulse'
      };
    }

    return {
      icon: MapPinOff,
      text: 'Paused',
      className: 'bg-muted text-muted-foreground border-border',
      dotClassName: 'bg-muted-foreground'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <>
      <button
        onClick={handleToggle}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all hover:scale-105 active:scale-95',
          config.className
        )}
      >
        <div className={cn('w-2 h-2 rounded-full', config.dotClassName)} />
        <Icon className="w-4 h-4" />
        <span>{config.text}</span>
      </button>

      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Location Permission Required</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>
                Spotmate needs your location to show you nearby people and help others find you during meetups.
              </p>
              <p>
                <strong>We respect your privacy:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your exact location is never shared</li>
                <li>Others only see approximate distance (~10m radius)</li>
                <li>Turn it off anytime with one tap</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPermissionDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowPermissionDialog(false);
                openLocationSettings();
              }}
              className="flex-1"
            >
              Open Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
