"use client"

import ListingContent from "@/components/listing-content";
import FilterPage from "@/components/pages/filterPage";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const params = useSearchParams();
  const zone = params.get('zone')
  const minPrice = params.get('minPrice')
  const maxPrice = params.get('maxPrice')
  const category = params.get('category')

  return (
    zone || minPrice || maxPrice || category ?
      <FilterPage
        location={zone || ""}
        minPrice={minPrice || ""}
        maxPrice={maxPrice || ""}
        category={category || ""}
      /> :
      <ListingContent
        isHome={true}
      />
  );
}
