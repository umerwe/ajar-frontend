import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { Listing } from "@/types/listing";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

const Document = ({ property }: { property: Listing }) => {
    const [open, setOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const document = property.documents?.[0];
   
    const imageUrl =
        document && process.env.NEXT_PUBLIC_API_BASE_URL + document.filesUrl?.[0];

    return (
        <>
            {/* === Document Button + Dialog === */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className="flex items-center gap-2 hover:bg-aqua
                         hover:text-white transition-all max-w-[150px]  "

                    >
                        <FileIcon className="h-4 w-4 text-white" />
                        Documents
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md rounded-2xl shadow-xl border border-gray-200">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            Document Details
                        </DialogTitle>
                    </DialogHeader>

                    {document ? (
                        <div className="space-y-4 mt-3">
                            {/* Name */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Name</span>
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                    {document.name}
                                </span>
                            </div>

                            {/* File URL (image preview) */}
                            <div>
                                <span className="text-sm text-gray-500">File</span>
                                <Image
                                    src={imageUrl}
                                    alt={document.name}
                                    onClick={() => setLightboxOpen(true)}
                                    width={500}
                                    height={500}
                                    className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            No document available.
                        </p>
                    )}
                </DialogContent>
            </Dialog>

            {/* === Lightbox Image Viewer === */}
            {lightboxOpen && imageUrl && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[
                        {
                            src: imageUrl,
                            title: document?.name,
                        },
                    ]}
                    carousel={{ finite: true }}
                    render={{
                        buttonPrev: () => null,
                        buttonNext: () => null,
                    }}
                />
            )}
        </>
    );
};

export default Document;