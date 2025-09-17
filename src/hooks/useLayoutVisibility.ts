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

  // ✅ Detect search results page
  const isSearchPage = segments[0] === "search" && searchParams.get("name");

  return {
    showCategories: (isCategoryPage || segments[0] === "listing") && !isDetailPage && !isSearchPage,
    showSearchBar: (isHomePage || isCategoryPage || segments[0] === "listing" || isSearchPage) && !isDetailPage,
  };
}
