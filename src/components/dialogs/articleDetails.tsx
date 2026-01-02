"use client";

import Image from "next/image";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetArticle } from "@/hooks/useArticles";
import { capitalizeWords } from "@/utils/capitalizeWords";

export default function ArticleDetailDialog({
    open,
    onOpenChange,
    articleId,
}: ArticleDetailDialogProps) {
    const { data: articleDetail, isLoading: isLoadingDetail } = useGetArticle(articleId as string);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                {isLoadingDetail ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <DialogTitle className="sr-only">Loading Details</DialogTitle>
                        <Loader2 className="h-10 w-10 animate-spin text-aqua" />
                    </div>
                ) : articleDetail ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                                {capitalizeWords(articleDetail.title)}
                            </DialogTitle>
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
    );
}