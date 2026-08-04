"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationMapProps {
  location: Location;
}

const mapOptions: google.maps.MapOptions = {
  clickableIcons: false,
  disableDefaultUI: true,
  fullscreenControl: true,
  gestureHandling: "cooperative",
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: true,
};

const LocationMap = ({ location }: LocationMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const center = { lat: location.lat, lng: location.lng };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
  });

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        Google Maps API key missing
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        Unable to load map
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      center={center}
      mapContainerClassName="w-full h-full"
      options={mapOptions}
      zoom={15}
    >
      <MarkerF position={center} title={location.address} />
    </GoogleMap>
  );
};

export default LocationMap;
