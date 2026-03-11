"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface MyImageProps extends ImageProps {
    fallbackSrc?: string;
}

const MyImage = ({
    src,
    alt,
    fallbackSrc = "/fallback.png",
    className,
    fill,
    ...props
}: MyImageProps) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setImgSrc(src);
        setIsLoading(true);
    }, [src]);

    const imageEl = (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            fill={fill}
            onLoad={() => setIsLoading(false)}
            onError={() => {
                setImgSrc(fallbackSrc);
                setIsLoading(false);
            }}
            className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"
                } ${className ?? ""}`}
        />
    );

    if (fill) {
        return (
            <>
                {isLoading && (
                    <div className="absolute inset-0 z-10 animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-300" />
                )}
                {imageEl}
            </>
        );
    }

    // normal mode — wrap in relative container with skeleton
    return (
        <div className="relative w-full h-full overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 z-10 animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-300" />
            )}
            {imageEl}
        </div>
    );
};

export default MyImage;