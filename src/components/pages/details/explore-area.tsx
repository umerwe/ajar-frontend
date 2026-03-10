"use client";

import { Listing } from '@/types/listing';
import { ChevronRight, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ViewOnlyMap = dynamic(() => import("@/components/maps/ViewOnlyMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">Loading Map...</div>
});

const ExploreArea = ({ property }: { property: Listing }) => {

    const { formattedPolygons, googleMapsUrl } = useMemo(() => {
        const poly = property.zone?.polygons;
        if (!poly) return { formattedPolygons: [], googleMapsUrl: "#" };

        let convertedPolygons: { lat: number; lng: number }[][] = [];

        // 1. Convert MultiPolygon to LatLng Array
        if ((poly as any).type === "MultiPolygon") {
            convertedPolygons = (poly as any).coordinates.map(
                (polygon: number[][][]) =>
                    polygon[0].map((coord: number[]) => ({
                        lat: coord[1],
                        lng: coord[0]
                    }))
            );
        }
        else if ((poly as any).type === "Polygon") {
            convertedPolygons = (poly as any).coordinates.map(
                (ring: number[][]) =>
                    ring.map((coord: number[]) => ({
                        lat: coord[1],
                        lng: coord[0]
                    }))
            );
        }
        else if (Array.isArray(poly)) {
            convertedPolygons = poly;
        }

        // 2. Calculate Center Point for Google Maps Navigation
        let url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.zone?.name || "")}`;

        if (convertedPolygons.length > 0) {
            const firstPolygon = convertedPolygons[0];

            // Basic Centroid Calculation (Average of all points)
            const latSum = firstPolygon.reduce((acc, curr) => acc + curr.lat, 0);
            const lngSum = firstPolygon.reduce((acc, curr) => acc + curr.lng, 0);

            const centerLat = latSum / firstPolygon.length;
            const centerLng = lngSum / firstPolygon.length;

            // Update URL to use exact Coordinates
            url = `https://www.google.com/maps/dir/?api=1&destination=${centerLat},${centerLng}`;
        }

        return {
            formattedPolygons: convertedPolygons,
            googleMapsUrl: url
        };
    }, [property.zone]);

    return (
        <div className='space-y-4'>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Explore the area</h2>

            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="w-full h-48 md:h-56 bg-gray-50 relative">
                    {formattedPolygons.length > 0 ? (
                        <ViewOnlyMap polygons={formattedPolygons} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No area data available
                        </div>
                    )}
                </div>

                <div className="p-4 flex justify-between items-center border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-aqua" />
                        <span className="font-medium text-gray-900 capitalize">
                            {property.zone?.name || "Unknown Zone"}
                        </span>
                    </div>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-aqua text-sm font-semibold flex items-center hover:underline"
                    >
                        Navigate to Area
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ExploreArea;