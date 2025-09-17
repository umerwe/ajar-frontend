"use client"

import { useSearchParams } from "next/navigation"
import { useSearch } from "@/hooks/useSearch"
import MainCard from "@/components/cards/main-card"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || ""

  const { data, isLoading, error } = useSearch({ name })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error loading results</p>
  if (!data || data.length === 0) return <p>No results found</p>

  return <MainCard listings={data} showRemoveButton={false} />
}
