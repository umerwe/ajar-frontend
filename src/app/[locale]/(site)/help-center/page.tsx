"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Loader2, ArrowRight, Search, ChevronRight, FileText, AlertCircle } from "lucide-react"
import { format } from "date-fns"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Import your custom Pagination component
import Pagination from "@/components/ui/pagination"

import { useGetArticles, useGetArticle } from "@/hooks/useArticles"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { useCreateChat } from "@/hooks/useChat"
import { useRouter } from "next/navigation"

export default function ArticlesSection() {
    const router = useRouter();
    const { mutate } = useCreateChat();
    // State
    const [page, setPage] = useState(1)
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Search State
    const [searchTerm, setSearchTerm] = useState("") // What user types
    const [activeSearch, setActiveSearch] = useState("") // What is sent to API

    // Hook: Passed activeSearch to the API hook
    const {
        data: articlesData,
        isLoading: isLoadingList,
        isError,
        error
    } = useGetArticles(page, activeSearch)

    const { data: articleDetail, isLoading: isLoadingDetail } = useGetArticle(selectedArticleId as string)

    // Calculate Total Pages
    const totalItems = articlesData?.total || 0
    const limit = articlesData?.limit || 10
    const totalPages = Math.ceil(totalItems / limit)

    // Handle Page Change
    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    // Handle Search Submit
    const handleSearch = () => {
        setPage(1) // Reset to page 1 on new search
        setActiveSearch(searchTerm)
    }

    // Handle 'Enter' key in search input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleLearnMore = (id: string) => {
        setSelectedArticleId(id)
        setIsDialogOpen(true)
    }

    const handleClick = () => {
        mutate(
            {
                receiverId: "685a3e02b9d2819129f6ccc3"
            },
            {
                onSuccess: (data) => {
                    console.log("Mutation successful:", data);
                    router.push(`/chat?id=${data._id}`)
                },
                onError: (error) => {
                    console.error("Mutation failed:", error);
                }
            }
        );
    };


    return (
        <div className="min-h-screen bg-white">

            {/* --- HERO SECTION --- */}
            <div className="relative mt-12 bg-header overflow-hidden flex justify-between rounded-md mx-4 md:mx-15">
                <div className="relative max-w-7xl flex items-center mx-5 md:mx-10 py-6 lg:py-6 xl:py-8">
                    <div className="max-w-2xl">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Help Center</h2>
                        <p className="text-emerald-100 mb-4 text-sm md:text-base">
                            Find answers to your questions and explore our latest articles and updates.
                        </p>

                        {/* Search Bar Integration */}
                        <div className="flex items-center gap-2 w-full max-w-md">
                            <div className="relative w-full">
                                <Input
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pr-14 pl-5 h-12 w-full text-base bg-white border-0 ring-offset-0 focus-visible:ring-2 focus-visible:ring-emerald-500/50 shadow-md rounded-xl text-gray-800 placeholder:text-gray-400"
                                />

                                {/* Beautified Search Button inside Input */}
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

            {/* --- ARTICLES GRID SECTION --- */}
            <div className="mx-4 md:mx-15 py-15">

                {/* Error Handling UI */}
                {isError ? (
                    <div className="flex justify-center py-10">
                        <Alert variant="destructive" className="max-w-2xl bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-800 font-semibold">Error loading articles</AlertTitle>
                            <AlertDescription className="text-red-700 mt-2">
                                {error instanceof Error ? error.message : "Something went wrong while fetching articles. Please try again later."}
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="bg-white border-red-200 hover:bg-red-50 text-red-800"
                                    >
                                        Reload Page
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoadingList ? (
                            // --- SKELETON LOADER ---
                            Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="border border-gray-200 shadow-sm h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-start mb-4">
                                            <Skeleton className="w-12 h-12 rounded-lg shrink-0 mr-4" />
                                            <div className="flex-1">
                                                <Skeleton className="h-5 w-3/4 mb-2" />
                                                <Skeleton className="h-3 w-1/4" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-5/6" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : articlesData?.articles?.length === 0 ? (
                            // Empty State
                            <div className="col-span-full text-center py-10 text-gray-500">
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
                                    <CardContent className="p-6">
                                        <div className="flex items-start mb-4">
                                            {/* Icon / Thumbnail Box */}
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
                                                e.stopPropagation(); // Prevent card click
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

                {/* --- PAGINATION --- */}
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

            {/* --- BOTTOM SECTION --- */}
            <div className="bg-gray-100 relative mt-10">
                <div className="mx-auto px-4 sm:px-6 lg:px-16 pt-15 pb-10 xl:px-40">
                    <Image
                        src={'/help-icon.png'}
                        alt='help-icon'
                        width={40}
                        height={40}
                        className="hidden lg:absolute lg:block bottom-34 left-115 opacity-80"
                    />
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="text-center lg:text-left mb-8 lg:mb-0">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                Still have questions?
                            </h3>
                            <p className="text-gray-600">
                                Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
                            </p>
                        </div>

                        <div className="flex items-center relative">
                            <Button
                                onClick={handleClick}
                                className="bg-white hover:bg-gray-200 text-black px-7 py-6 rounded-md text-base font-medium shadow-sm border border-gray-200">
                                Get in Touch
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>

                            <Image
                                src={'/help-icon.png'}
                                alt='help-icon'
                                width={30}
                                height={30}
                                className="lg:absolute top-5 right-60 hidden lg:block opacity-60"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DETAILS DIALOG --- */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setSelectedArticleId(null);
            }}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {isLoadingDetail ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <DialogTitle className="sr-only">Loading Details</DialogTitle>
                            <Loader2 className="h-10 w-10 animate-spin text-aqua" />
                        </div>
                    ) : articleDetail ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">{capitalizeWords(articleDetail.title)}</DialogTitle>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <FileText className="mr-2 h-4 w-4" />
                                    {format(new Date(articleDetail.createdAt), "MMMM dd, yyyy")}
                                </div>
                            </DialogHeader>

                            <div className="mt-4 space-y-6">
                                {articleDetail.images && articleDetail.images.length > 0 && (
                                    <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-100">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${articleDetail.images[0]}`}
                                            alt={articleDetail.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className="prose prose-stone dark:prose-invert max-w-none">
                                    <DialogDescription className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                                        {articleDetail.description}
                                    </DialogDescription>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-10 text-center text-muted-foreground">
                            <DialogTitle className="sr-only">Error</DialogTitle>
                            Failed to load article details.
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}