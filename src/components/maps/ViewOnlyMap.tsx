"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

interface Props {
  polygons?: { lat: number; lng: number }[][];
}

// Internal component to handle auto-zooming to the polygon
const MapContent = ({ polygons }: Props) => {
  const map = useMap();
  const layerGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    layerGroupRef.current.addTo(map);

    if (polygons && polygons.length > 0) {
      layerGroupRef.current.clearLayers();

      polygons.forEach((points) => {
        const latLngs = points.map((pt) => new L.LatLng(pt.lat, pt.lng));
        const polygon = L.polygon(latLngs, {
          color: "#00CFBA", // Your aqua brand color
          weight: 3,
          fillOpacity: 0.2,
        });
        layerGroupRef.current.addLayer(polygon);
      });

      // Fit the map view to the polygons
      const allPoints = polygons.flat().map((pt) => [pt.lat, pt.lng] as [number, number]);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [polygons, map]);

  return null;
};

const ViewOnlyMap = ({ polygons }: Props) => {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap'
        />
        <MapContent polygons={polygons} />
      </MapContainer>
    </div>
  );
};

export default ViewOnlyMap;