"use client";

import Header from "@/components/ui/header";
import Error from "@/components/common/error";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFaqs } from "@/hooks/useFaqs";
import { ChevronDown, HelpCircle } from "lucide-react";
import React from "react";

const Faqs = () => {
    const { data, isLoading, isError } = useGetFaqs();
    const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);
    const faqs: FAQ[] = data?.data || [];

    if (isError) {
        return <Error />;
    }

    return (
        <div>
            <Header title="FAQs" />

            <div className="max-w-3xl mx-auto my-6 md:my-10">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-aqua/10 flex items-center justify-center">
                                <HelpCircle className="h-5 w-5 text-aqua" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
                                <p className="text-sm text-gray-500">Find quick answers about Ajar.</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 py-2">
                        {isLoading ? (
                            <div className="space-y-4 py-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <Skeleton className="h-5 w-4/5" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : faqs.length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-500">No FAQs available.</p>
                        ) : (
                            faqs.map((faq) => {
                                const isOpen = openFaqId === faq._id;

                                return (
                                    <div key={faq._id} className="border-b border-gray-100 last:border-b-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqId(isOpen ? null : faq._id)}
                                            className="flex w-full items-center justify-between gap-4 py-5 text-left"
                                        >
                                            <span className="text-sm sm:text-base font-medium text-gray-900">
                                                {faq.question}
                                            </span>
                                            <ChevronDown
                                                className={`h-5 w-5 shrink-0 text-aqua transition-transform ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <p className="pb-5 text-sm leading-relaxed text-gray-600">
                                                {faq.answer}
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
