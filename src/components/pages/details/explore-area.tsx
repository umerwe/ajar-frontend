"use client";

import { Listing } from '@/types/listing';
import { ChevronRight, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

const MapLoadingFallback = () => {
    const t = useTranslations("translation");

    return (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">
            {t("loadingMap")}
        </div>
    );
};

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
    ssr: false,
    loading: () => <MapLoadingFallback />
});

const ExploreArea = ({ property }: { property: Listing }) => {
    const t = useTranslations("translation");
    const location = property.location;
    const hasLocation = typeof location?.lat === "number" && typeof location?.lng === "number";

    const googleMapsUrl = useMemo(() => {
        if (!hasLocation) return "#";

        return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    }, [hasLocation, location?.lat, location?.lng]);

    return (
        <div className='space-y-4'>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">{t("location")}</h2>

            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="w-full h-48 md:h-56 bg-gray-50 relative">
                    {hasLocation ? (
                        <LocationMap location={location} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            {t("noLocationDataAvailable")}
                        </div>
                    )}
                </div>

                <div className="p-4 flex justify-between items-center border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-aqua" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                            {location?.address || t("unknownLocation")}
                        </span>
                    </div>

                    {hasLocation && (
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-aqua text-sm font-medium flex items-center hover:underline"
                        >
                            {t("navigate")}
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExploreArea;
