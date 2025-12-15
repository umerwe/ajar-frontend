import { useForm } from "react-hook-form";
import Input from "../ui/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";
import { EditProfile } from "@/types/auth";
import React from "react";
import Image from "next/image";
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Loader from "../common/loader";
import { formatFileSize } from "@/utils/formatFileSize";

export default function EditProfileForm({
    file,
    setOpen,
    documents = [],
    user
}: ProfileProps) {
    const { mutate, isPending } = useUpdateUser();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            dob: "",
            nationality: "",
        },
    });

    const [docFiles, setDocFiles] = React.useState<{ [key: string]: File | null }>({});

    const onSubmit = (data: EditProfile) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.dob) formData.append("dob", data.dob);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (file) formData.append("profilePicture", file);

        documents.forEach((doc: Document) => {
            const docFile = docFiles[doc.value];
            if (docFile) {
                formData.append(doc.value, docFile);
            }
        });

        mutate(formData, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const handleDocChange = (value: string, selectedFile: File | null) => {
        setDocFiles((prev) => ({
            ...prev,
            [value]: selectedFile,
        }));
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Name"
                placeholder="Enter your name"
                type="text" register={register("name")}
            />

            <Input
                label="Date of Birth"
                type="date"
                register={register("dob")}
            />

            <Input
                label="Nationality"
                placeholder="Enter your country"
                type="text"
                register={register("nationality")} />

            {user?.documents && user.documents.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Upload Documents
                    </h3>

                    <div className="space-y-3">
                        {user.documents.map((doc) => (
                            <div key={doc._id} className="p-3 border rounded-lg bg-gray-50">

                                {/* Header: Name + Status */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {doc.name.replace("_", " ").toUpperCase()}
                                    </span>

                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : doc.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {capitalizeWords(doc?.status as string)}
                                    </span>
                                </div>

                                {/* Show existing preview if available */}
                                {doc?.filesUrl?.length !== 0 && (
                                    <div className="mb-2">
                                        <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                            {doc.filesUrl?.map((url, index) => (
                                                <a
                                                    key={index}
                                                    href={process.env.NEXT_PUBLIC_API_BASE_URL + url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0"
                                                >
                                                    {url.endsWith(".pdf") ? (
                                                        <div className="flex items-center justify-center h-full bg-gray-200 text-sm text-gray-600 cursor-pointer">
                                                            PDF File
                                                        </div>
                                                    ) : (
                                                        <Image
                                                            src={process.env.NEXT_PUBLIC_API_BASE_URL + url}
                                                            alt="Document preview"
                                                            fill
                                                            className="object-cover cursor-pointer"
                                                        />
                                                    )}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* File Upload */}
                                <div>
                                    <input
                                        type="file"
                                        id={`file-${doc.name}`}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files?.[0] || null;
                                            handleDocChange(doc.name, selectedFile);
                                        }}
                                    />

                                    {docFiles[doc.name] ? (
                                        <div className="flex items-center justify-between p-2 bg-white border-2 border-blue-500 rounded-lg">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="flex-shrink-0">
                                                    {docFiles[doc.name]!.type.startsWith('image/') ? (
                                                        <div className="w-10 h-10 rounded bg-blue-50 overflow-hidden">
                                                            <Image
                                                                src={URL.createObjectURL(docFiles[doc.name]!)}
                                                                alt="Preview"
                                                                width={40}
                                                                height={40}
                                                                className="w-10 h-10 object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                                                            <File className="w-5 h-5 text-blue-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">
                                                        {docFiles[doc.name]!.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(docFiles[doc.name]!.size)}
                                                    </p>
                                                </div>
                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDocChange(doc.name, null)}
                                                className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <X className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`file-${doc.name}`}
                                            className="flex items-center justify-center gap-2 p-3 border-2 mt-4 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-aqua hover:bg-blue-50 transition-all"
                                        >
                                            <Upload className="w-5 h-5 text-gray-400" />
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-gray-700">
                                                    Click to upload new file
                                                </p>
                                                <p className="text-xs text-gray-500">PDF or Image</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Button variant="destructive" className="w-full" type="submit" disabled={isPending}>
                {isPending ? <Loader /> : "Save Changes"}
            </Button>
        </form>
    );
}