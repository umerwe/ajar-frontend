import type React from "react"
import ListingContent from "@/components/listing-content"
import SubCategories from "@/components/sub-categories"

export default async function CategoryPage({
  params,
}: { params: Promise<{ category_id: string }> }): Promise<React.ReactElement> {
  const { category_id } = await params
  return (
    <>
      <SubCategories />
      <ListingContent initialCategory={category_id} />
    </>
  )
}
