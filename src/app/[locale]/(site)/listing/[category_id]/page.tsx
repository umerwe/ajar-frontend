import type React from "react"
import ListingContent from "@/components/listing-content"

// This is an async Server Component for SEO benefits
export default async function CategoryPage({
  params,
}: { params: Promise<{ category_id: string }> }): Promise<React.ReactElement> {
  const { category_id } = await params
  return <ListingContent initialCategory={category_id} />
}
  