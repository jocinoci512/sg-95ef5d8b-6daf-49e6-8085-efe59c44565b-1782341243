// Live Shipment Map Component with Auto-Routing
import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapService } from "@/lib/mapService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, TrendingUp, Clock, Navigation } from "lucide-react";

interface LiveShipmentMapProps {
  pickupAddress: string;
  deliveryAddress: string;
  currentStatus: string;
  shipmentType: string;
  trackingNumber: string;
}

export function LiveShipmentMap({
  pickupAddress,
  deliveryAddress,
  currentStatus,
  shipmentType,
  trackingNumber,
}: LiveShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Calculate progress based on status
  const getProgressByStatus = (status: string): number => {
    const progressMap: Record<string, number> = {
      pending: 0,
      processing: 10,
      dispatched: 20,
      in_transit: 50,
      arrived_at_hub: 70,
      customs_clearance: 75,
      out_for_delivery: 90,
      delivered: 100,
    };
    return progressMap[status] || 0;
  };

  useEffect(() => {
    initializeMap();
  }, [pickupAddress, deliveryAddress]);

  useEffect(() => {
    if (routeData) {
      const newProgress = getProgressByStatus(currentStatus);
      setProgress(newProgress);
      updateVehiclePosition(newProgress);
    }
  }, [currentStatus, routeData]);

  const initializeMap = async () => {
    if (!pickupAddress || !deliveryAddress) {
      setError("Pickup and delivery addresses are required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load Google Maps JavaScript API
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
        libraries: ["places", "geometry"],
      });

      // Load the library - makes google.maps globally available
      await loader.loadCallback((e: Event) => {
        if (e.type === "error") {
          throw new Error("Failed to load Google Maps");
        }
      });

      // Calculate route
      const route = await MapService.calculateRoute(pickupAddress, deliveryAddress);

      if (!route) {
        throw new Error("Could not calculate route. Please verify addresses.");
      }

      setRouteData(route);

      // Initialize map using google.maps after loading
      if (mapRef.current && typeof google !== "undefined") {
        const map = new google.maps.Map(mapRef.current, {
          center: route.pickupCoords,
          zoom: 6,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#1a1a2e" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0f172a" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#2d2d44" }],
            },
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        googleMapRef.current = map;

        // Add pickup marker
        new google.maps.Marker({
          position: route.pickupCoords,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#F59E0B",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
          title: "Pickup Location",
        });

        // Add delivery marker
        new google.maps.Marker({
          position: route.deliveryCoords,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#10B981",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
          title: "Delivery Location",
        });

        // Draw route
        const routePath = new google.maps.Polyline({
          path: route.route,
          geodesic: true,
          strokeColor: "#FB923C",
          strokeOpacity: 0.6,
          strokeWeight: 4,
          map,
        });

        polylineRef.current = routePath;

        // Add vehicle marker
        const vehicleIcon = getVehicleIcon(shipmentType);
        const initialProgress = getProgressByStatus(currentStatus);
        const currentPos = MapService.calculateCurrentPosition(route.route, initialProgress);

        const vehicleMarker = new google.maps.Marker({
          position: currentPos,
          map,
          icon: {
            url: vehicleIcon,
            scaledSize: new google.maps.Size(40, 40),
          },
          title: `Shipment ${trackingNumber}`,
        });

        vehicleMarkerRef.current = vehicleMarker;
        setProgress(initialProgress);

        // Fit bounds to show entire route
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(route.pickupCoords);
        bounds.extend(route.deliveryCoords);
        map.fitBounds(bounds);
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Map initialization error:", err);
      setError(err.message || "Failed to load map");
      setLoading(false);
    }
  };

  const updateVehiclePosition = (progressPercent: number) => {
    if (!routeData || !vehicleMarkerRef.current) return;

    const newPosition = MapService.calculateCurrentPosition(
      routeData.route,
      progressPercent
    );

    // Animate marker movement
    vehicleMarkerRef.current.setPosition(newPosition);

    // Center map on vehicle
    if (googleMapRef.current) {
      googleMapRef.current.panTo(newPosition);
    }
  };

  const getVehicleIcon = (type: string): string => {
    // Return different vehicle icons based on shipment type
    const iconMap: Record<string, string> = {
      air_freight: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F59E0B'%3E%3Cpath d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'/%3E%3C/svg%3E",
      ocean_freight: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306B6D4'%3E%3Cpath d='M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v-2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.32-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.27.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z'/%3E%3C/svg%3E",
      road_freight: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F59E0B'%3E%3Cpath d='M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm1.5-9H17V12h4.46L19.5 9.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3zM3 6v9h.76c.55-.61 1.35-1 2.24-1s1.69.39 2.24 1H15V6H3z'/%3E%3C/svg%3E",
      rail_freight: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B5CF6'%3E%3Cpath d='M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z'/%3E%3C/svg%3E",
    };

    return iconMap[type] || iconMap.road_freight;
  };

  const formatDistance = (km: number) => {
    return km > 1 ? `${km.toFixed(0)} km` : `${(km * 1000).toFixed(0)} m`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (error) {
    return (
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Map Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Live Shipment Tracking
          </CardTitle>
          {routeData && (
            <Badge variant="outline" className="font-mono">
              {progress}% Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Calculating route...</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden mb-4" />
            
            {routeData && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Total Distance</p>
                  <p className="text-lg font-bold font-mono">
                    {formatDistance(routeData.distance)}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Est. Duration</p>
                  <p className="text-lg font-bold font-mono">
                    {formatDuration(routeData.duration)}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Progress</p>
                  <p className="text-lg font-bold font-mono">{progress}%</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}