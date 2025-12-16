"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Search, ChevronRight, FileText } from "lucide-react"
import { format } from "date-fns"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Pagination from "@/components/ui/pagination"
import { useGetArticles } from "@/hooks/useArticles"
import { capitalizeWords } from "@/utils/capitalizeWords"
import Error from "@/components/common/error"
import { Skeleton } from "@/components/ui/skeleton"
import GetInTouch from "@/components/getInTouch"
import ArticleDetailDialog from "@/components/dialogs/articleDetails"
import SkeletonLoader from "@/components/common/skeleton-loader"

export default function ArticlesSection() {
    const [page, setPage] = useState(1)
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeSearch, setActiveSearch] = useState("")

    const {
        data: articlesData,
        isLoading: isLoadingList,
        isError
    } = useGetArticles(page, activeSearch)

    const totalItems = articlesData?.total || 0
    const limit = articlesData?.limit || 10
    const totalPages = Math.ceil(totalItems / limit)

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    const handleSearch = () => {
        setPage(1)
        setActiveSearch(searchTerm)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleLearnMore = (id: string) => {
        setSelectedArticleId(id)
        setIsDialogOpen(true)
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="px-3 sm:mx-6 lg:mx-8 mt-6 md:mt-12">
                <div className="relative bg-header overflow-hidden flex justify-between rounded-md max-w-7xl mx-auto shrink-0">
                    <div className="relative flex items-center mx-5 md:mx-10 py-6 lg:py-6 xl:py-8">
                        <div className="max-w-2xl">
                            <h2 className="text-xl md:text-2xl font-bold text-white">Help Center</h2>
                            <p className="text-emerald-100 mb-4 text-sm md:text-base">
                                Find answers to your questions and explore our latest articles and updates.
                            </p>

                            <div className="flex items-center gap-2 w-full max-w-md">
                                <div className="relative w-full">
                                    <Input
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="pr-14 pl-5 h-12 w-full text-sm md:text-base bg-white border-0 ring-offset-0 focus-visible:ring-2 focus-visible:ring-emerald-500/50 shadow-md rounded-xl text-gray-800 placeholder:text-gray-400"
                                    />

                                    <div
                                        onClick={handleSearch}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-gray-100 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer group shadow-sm"
                                    >
                                        <Search
                                            className="w-5 h-5 text-aqua group-hover:scale-110 transition-transform duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='hidden lg:block'>
                        <Image
                            src="/topographic-img.png"
                            alt="Topographic background"
                            width={450}
                            height={450}
                            className="object-cover mix-blend-overlay opacity-30"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6 md:mb-10 pt-6 md:pt-12">
                <div className="pb-15 max-w-7xl mx-auto px-3 sm:px-0">
                    {isError ? (
                        <Error
                            className="my-24"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {isLoadingList ? (
                                <SkeletonLoader variant="article" />
                            ) : articlesData?.articles?.length === 0 ? (
                                <div className="col-span-full text-center pt-24 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-lg font-medium">No articles found</p>
                                    <p className="text-sm">Try adjusting your search terms.</p>
                                </div>
                            ) : (
                                articlesData?.articles.map((article: Article) => (
                                    <Card
                                        key={article._id}
                                        onClick={() => handleLearnMore(article._id)}
                                        className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 shadow-sm group h-full cursor-pointer"
                                    >
                                        <CardContent className="md:p-6 p-4">
                                            <div className="flex items-start mb-4">
                                                <div className="w-12 h-12 bg-aqua/10 rounded-lg overflow-hidden flex items-center justify-center mr-4 shrink-0 relative">
                                                    {article.images && article.images.length > 0 ? (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${article.images[0]}`}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-aqua" />
                                                    )}
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-header transition-colors">
                                                        {capitalizeWords(article.title)}
                                                    </h3>
                                                    <div className="text-xs text-gray-400 mb-2">
                                                        {format(new Date(article.createdAt), "MMM dd, yyyy")}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                                {article.description}
                                            </p>

                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLearnMore(article._id);
                                                }}
                                                className="text-header hover:text-emerald-600 font-medium shadow-none p-0 h-auto hover:bg-transparent flex items-center bg-transparent"
                                            >
                                                <span className="mb-0.5 -ml-2">Learn more</span>
                                                <ChevronRight className="w-4 h-4 text-aqua" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {!isError && totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>


            <GetInTouch />

            <ArticleDetailDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedArticleId(null);
                }}
                articleId={selectedArticleId}
            />
        </div>
    )
}