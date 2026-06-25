// Enterprise Map Service for Live Shipment Tracking
// Auto-routing, distance calculation, and real-time animation

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteData {
  pickupCoords: Coordinates;
  deliveryCoords: Coordinates;
  distance: number;
  duration: number;
  route: Coordinates[];
}

export class MapService {
  private static GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  /**
   * Geocode an address to coordinates
   */
  static async geocodeAddress(address: string): Promise<Coordinates | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  /**
   * Calculate route between two addresses
   */
  static async calculateRoute(
    pickupAddress: string,
    deliveryAddress: string
  ): Promise<RouteData | null> {
    try {
      // Geocode both addresses
      const pickupCoords = await this.geocodeAddress(pickupAddress);
      const deliveryCoords = await this.geocodeAddress(deliveryAddress);

      if (!pickupCoords || !deliveryCoords) {
        return null;
      }

      // Get route using Directions API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupCoords.lat},${pickupCoords.lng}&destination=${deliveryCoords.lat},${deliveryCoords.lng}&key=${this.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        // Decode polyline to get route coordinates
        const routeCoords = this.decodePolyline(route.overview_polyline.points);

        return {
          pickupCoords,
          deliveryCoords,
          distance: leg.distance.value / 1000, // Convert to km
          duration: leg.duration.value / 60, // Convert to minutes
          route: routeCoords,
        };
      }

      return null;
    } catch (error) {
      console.error("Route calculation error:", error);
      return null;
    }
  }

  /**
   * Calculate current position based on progress percentage
   */
  static calculateCurrentPosition(
    route: Coordinates[],
    progressPercentage: number
  ): Coordinates {
    if (route.length === 0) {
      return { lat: 0, lng: 0 };
    }

    if (progressPercentage <= 0) {
      return route[0];
    }

    if (progressPercentage >= 100) {
      return route[route.length - 1];
    }

    const targetIndex = Math.floor((progressPercentage / 100) * (route.length - 1));
    return route[targetIndex] || route[0];
  }

  /**
   * Decode Google Maps polyline
   */
  private static decodePolyline(encoded: string): Coordinates[] {
    const coordinates: Coordinates[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }

    return coordinates;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLon = this.toRadians(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) *
        Math.cos(this.toRadians(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Shipment type configurations
export const SHIPMENT_TYPES = {
  air_freight: {
    label: "Air Freight",
    icon: "Plane",
    color: "blue",
    vehicle: "airplane",
    description: "Fast international air cargo",
  },
  ocean_freight: {
    label: "Ocean Freight",
    icon: "Ship",
    color: "cyan",
    vehicle: "ship",
    description: "Container shipping by sea",
  },
  road_freight: {
    label: "Road Freight",
    icon: "Truck",
    color: "orange",
    vehicle: "truck",
    description: "Ground transportation",
  },
  rail_freight: {
    label: "Rail Freight",
    icon: "Train",
    color: "purple",
    vehicle: "train",
    description: "Railway cargo transport",
  },
  express_delivery: {
    label: "Express Delivery",
    icon: "Zap",
    color: "red",
    vehicle: "truck",
    description: "Same-day delivery service",
  },
  standard_delivery: {
    label: "Standard Delivery",
    icon: "Package",
    color: "gray",
    vehicle: "truck",
    description: "Regular delivery service",
  },
  overnight_shipping: {
    label: "Overnight Shipping",
    icon: "Moon",
    color: "indigo",
    vehicle: "truck",
    description: "Next-day delivery",
  },
  same_day_delivery: {
    label: "Same-Day Delivery",
    icon: "Clock",
    color: "green",
    vehicle: "truck",
    description: "Delivered same day",
  },
  international_shipping: {
    label: "International Shipping",
    icon: "Globe",
    color: "blue",
    vehicle: "airplane",
    description: "Cross-border shipping",
  },
  domestic_shipping: {
    label: "Domestic Shipping",
    icon: "MapPin",
    color: "amber",
    vehicle: "truck",
    description: "Within country delivery",
  },
  heavy_cargo: {
    label: "Heavy Cargo",
    icon: "Weight",
    color: "slate",
    vehicle: "truck",
    description: "Oversized freight",
  },
  vehicle_shipping: {
    label: "Vehicle Shipping",
    icon: "Car",
    color: "zinc",
    vehicle: "carrier",
    description: "Auto transport service",
  },
  refrigerated_cargo: {
    label: "Refrigerated Cargo",
    icon: "Snowflake",
    color: "sky",
    vehicle: "truck",
    description: "Temperature controlled",
  },
  dangerous_goods: {
    label: "Dangerous Goods",
    icon: "AlertTriangle",
    color: "yellow",
    vehicle: "truck",
    description: "Hazardous materials",
  },
  container_shipping: {
    label: "Container Shipping",
    icon: "Container",
    color: "teal",
    vehicle: "ship",
    description: "Full container load",
  },
  parcel_delivery: {
    label: "Parcel Delivery",
    icon: "Package2",
    color: "pink",
    vehicle: "truck",
    description: "Small package delivery",
  },
  document_delivery: {
    label: "Document Delivery",
    icon: "FileText",
    color: "violet",
    vehicle: "truck",
    description: "Document courier",
  },
  freight_forwarding: {
    label: "Freight Forwarding",
    icon: "ArrowRightLeft",
    color: "lime",
    vehicle: "truck",
    description: "Logistics coordination",
  },
} as const;

export type ShipmentType = keyof typeof SHIPMENT_TYPES;