"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import Image, { ImageProps, StaticImageData } from "next/image";

interface MyImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | File | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
  preventCache?: boolean;
}

// Global cache for loaded images
const LOADED_IMAGE_CACHE = new Set<string>();
// Global cache for failed images to prevent retry loops
const FAILED_IMAGE_CACHE = new Set<string>();

const normalizeUrl = (url: string) => {
  if (!url) return url;
  // Remove duplicate slashes but preserve protocol
  return url.replace(/([^:]\/)\/+/g, "$1");
};

const getImageKey = (src: any): string => {
  if (typeof src === "string") return src;
  if (src && typeof src === "object" && "src" in src) return src.src;
  if (src instanceof File) return src.name;
  return String(src);
};

const MyImage = ({
  src,
  alt,
  className,
  fallbackSrc = "/fallback.png",
  fallbackText,
  fill,
  preventCache = false,
  priority = false,
  ...rest
}: MyImageProps) => {
  // Memoize normalized src to prevent re-renders
  const resolvedSrc = useMemo(() => {
    if (!src) return null;
    if (typeof src === "string") return normalizeUrl(src);
    return src;
  }, [src]);

  const srcKey = useMemo(() => getImageKey(resolvedSrc), [resolvedSrc]);
  
  // Check caches
  const isAlreadyLoaded = !preventCache && srcKey ? LOADED_IMAGE_CACHE.has(srcKey) : false;
  const hasFailed = !preventCache && srcKey ? FAILED_IMAGE_CACHE.has(srcKey) : false;

  const [isLoading, setIsLoading] = useState(!isAlreadyLoaded && !hasFailed);
  const [isError, setIsError] = useState(!src || hasFailed);
  
  // Use ref to track if component is mounted
  const isMounted = useRef(true);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, []);

  // Reset states when src changes
  useEffect(() => {
    if (!src) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const wasLoaded = !preventCache && srcKey ? LOADED_IMAGE_CACHE.has(srcKey) : false;
    const failed = !preventCache && srcKey ? FAILED_IMAGE_CACHE.has(srcKey) : false;

    if (failed) {
      setIsError(true);
      setIsLoading(false);
    } else if (wasLoaded) {
      setIsError(false);
      setIsLoading(false);
    } else {
      setIsError(false);
      setIsLoading(true);
    }
  }, [srcKey, src, preventCache]);

  const handleLoadingComplete = useCallback(() => {
    if (!isMounted.current) return;
    if (!preventCache && srcKey) {
      LOADED_IMAGE_CACHE.add(srcKey);
    }
    setIsLoading(false);
    setIsError(false);
  }, [srcKey, preventCache]);

  const handleError = useCallback(() => {
    if (!isMounted.current) return;
    if (!preventCache && srcKey) {
      FAILED_IMAGE_CACHE.add(srcKey);
    }
    setIsError(true);
    setIsLoading(false);
  }, [srcKey, preventCache]);

  // Early return for error state
 if (isError || !resolvedSrc) {
  // Show fallback image instead of text
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Image
        src={fallbackSrc}
        alt={alt || "Fallback image"}
        fill={fill}
        className="object-cover"
        {...rest}
      />
      {/* Optional: Show error text overlay if needed */}
      {fallbackText && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-[10px] font-medium">
          {fallbackText}
        </div>
      )}
    </div>
  );
}

  // Render image with shimmer loader
  return (
    <>
      {/* SHIMMER LOADER */}
      {isLoading && (
        <div 
          className={cn(
            "animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]",
            fill ? "absolute inset-0 w-full h-full z-10" : "w-full h-full",
            className
          )} 
        />
      )}
      
      <Image
        src={resolvedSrc as string}
        alt={alt}
        fill={fill}
        priority={priority}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        {...rest}
      />
    </>
  );
};

export default MyImage;