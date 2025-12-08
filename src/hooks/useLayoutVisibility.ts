"use client";

import { usePathname, useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { categories } from "@/data/categories";

export function useLayoutVisibility() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const localePrefix = `/${locale}`;
  const normalizedPath =
    pathname.startsWith(localePrefix)
      ? pathname.slice(localePrefix.length) || "/"
      : pathname;

  const segments = normalizedPath.split("/").filter(Boolean);
  const basePath = `/${segments.slice(0, 2).join("/")}`;

  const isHomePage = normalizedPath === "/";
  const isDetailPage = segments.length > 2;

  const isCategoryPage =
    categories.some((cat) => cat.link === basePath) ||
    (segments[0] === "listing" && segments[1] && !isDetailPage) ||
    (segments[0] === "listing" && params.category);

  // ✅ Detect search params (agar koi bhi hai)
  const hasSearchParams = Array.from(searchParams.entries()).length > 0;

  return {
    showCategories:
      !hasSearchParams &&
      (isCategoryPage || segments[0] === "listing") &&
      !isDetailPage,
    showSearchBar:
      !hasSearchParams &&
      (isHomePage || isCategoryPage || segments[0] === "listing") &&
      !isDetailPage,
    hasSearchParams:
      !searchParams.get("zone") && !searchParams.get("minPrice") && !searchParams.get("maxPrice") && !searchParams.get("category") &&
      !searchParams.get("payment_intent") &&
      !searchParams.get("bookingId") &&
      !searchParams.get("payment_intent_client_secret") &&
      hasSearchParams,
  };
}
