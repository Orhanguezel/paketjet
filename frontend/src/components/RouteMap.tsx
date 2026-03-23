"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { getCityCoords, type CityCoord } from "@/lib/city-coords";

interface RouteMapProps {
  fromCity: string;
  toCity: string;
  /** Harita yüksekliği (default: 300px) */
  height?: number;
  /** Harita köşe yuvarlama */
  className?: string;
}

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: MAP_STYLES,
  gestureHandling: "cooperative",
};

const POLYLINE_OPTIONS: google.maps.PolylineOptions = {
  strokeColor: "#F97316",
  strokeOpacity: 0.8,
  strokeWeight: 3,
  geodesic: true,
};

export function RouteMap({
  fromCity,
  toCity,
  height = 300,
  className = "",
}: RouteMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const from = getCityCoords(fromCity);
  const to = getCityCoords(toCity);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (from && to) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(from);
        bounds.extend(to);
        map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
      }
    },
    [from, to],
  );

  // Şehirler değişince bounds güncelle
  useEffect(() => {
    if (!mapRef.current || !from || !to) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(from);
    bounds.extend(to);
    mapRef.current.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
  }, [from, to]);

  if (!from || !to) return null;
  if (loadError) return <div className="text-sm text-muted">Harita yüklenemedi</div>;
  if (!isLoaded) {
    return (
      <div
        className={`bg-surface-alt animate-pulse rounded-xl ${className}`}
        style={{ height }}
      />
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height, borderRadius: 12 }}
      mapContainerClassName={className}
      options={MAP_OPTIONS}
      onLoad={onLoad}
      center={from}
      zoom={6}
    >
      <Marker
        position={from}
        label={{ text: fromCity, className: "font-semibold text-xs" }}
      />
      <Marker
        position={to}
        label={{ text: toCity, className: "font-semibold text-xs" }}
      />
      <Polyline path={[from, to]} options={POLYLINE_OPTIONS} />
    </GoogleMap>
  );
}
