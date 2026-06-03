import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";
import React from "react";
import Image from "@/components/MyImage";
import { X } from "lucide-react";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Loader from "../common/loader";
import { EditProfileFormValues, EditProfileSchema } from "@/validations/profile";
import { toast } from "../ui/toast";
import { useRemoveDocumentFile } from "@/hooks/useDocument";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";


export default function EditProfileForm({
    file,
    setOpen,
    documents = [],
    user
}: ProfileProps) {
    const { mutate, isPending } = useUpdateUser();
    const { mutate: removeFile, isPending: isRemoving } = useRemoveDocumentFile(); // ← add this

    const { register, handleSubmit, formState: { errors } } = useForm<EditProfileFormValues>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            dob: user?.dob ? user.dob.split("T")[0] : "",
            nationality: user?.nationality || "",
        },
    });

    const [docFiles, setDocFiles] = React.useState<{ [key: string]: File | null }>({});
    const [fileToRemove, setFileToRemove] = React.useState<string | null>(null);

    const onSubmit = (data: EditProfileFormValues) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.phone) formData.append("phone", data.phone);
        if (data.dob) formData.append("dob", data.dob);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (file) formData.append("profilePicture", file);

        documents.forEach((doc: any) => {
            const docFile = docFiles[doc.value];
            if (docFile) {
                formData.append(doc.value, docFile);
            }
        });

        mutate(formData, {
            onSuccess: () => {
                setOpen(false);
                toast({
                    title: "User Updated Successfully",
                    variant: "default",
                });
            },
        });
    };

    const handleDocChange = (value: string, selectedFile: File | null) => {
        setDocFiles((prev) => ({
            ...prev,
            [value]: selectedFile,
        }));
    };

    // ← only new function added
    const handleRemoveFile = (fileUrl: string) => {
        removeFile(fileUrl, {
            onSuccess: () => {
                setFileToRemove(null);
                toast({ title: "File removed successfully", variant: "default" });
            },
            onError: () => {
                toast({ title: "Failed to remove file", variant: "destructive" });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Name"
                placeholder="Enter your name"
                type="text"
                register={register("name")}
                error={errors.name?.message}
            />

            <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                type="text"
                register={register("phone")}
                error={errors.phone?.message}
            />

            <Input
                label="Date of Birth"
                type="date"
                register={register("dob")}
                error={errors.dob?.message}
                onKeyDown={(e) => e.preventDefault()}
            />

            <Input
                label="Nationality"
                placeholder="Enter your country"
                type="text"
                register={register("nationality")}
                error={errors.nationality?.message}
            />

            {user?.documents && user.documents.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Documents
                    </h3>
                    <div className="space-y-3">
                        {user.documents.map((doc: any) => (
                            <div key={doc._id} className="p-3 border rounded-lg bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {doc.name.replace("_", " ").toUpperCase()}
                                    </span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.status === "approved" ? "bg-green-100 text-green-700" :
                                        doc.status === "rejected" ? "bg-red-100 text-red-700" :
                                            "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {capitalizeWords(doc?.status as string)}
                                    </span>
                                </div>

                                {doc?.fileUrl && (
                                    <div className="mb-2">
                                        <div className="relative w-24 h-24 flex-shrink-0 group">
                                            <div className="w-full h-full rounded-lg overflow-hidden border">
                                                {doc.fileUrl.endsWith(".pdf") ? (
                                                    <div className="flex items-center justify-center h-full bg-gray-200 text-sm text-gray-600">PDF</div>
                                                ) : (
                                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + doc.fileUrl} alt="preview" fill className="object-cover" />
                                                )}
                                            </div>
                                                <button
                                                    type="button"
                                                    disabled={isRemoving}
                                                    onClick={() => setFileToRemove(doc.name)}
                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow transition-opacity opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    id={`file-${doc.name}`}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleDocChange(doc.name, e.target.files?.[0] || null)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Button variant="destructive" className="w-full" type="submit" disabled={isPending}>
                {isPending ? <Loader /> : "Save Changes"}
            </Button>

            <ConfirmDialog
                open={Boolean(fileToRemove)}
                onOpenChange={(open) => {
                    if (!open) setFileToRemove(null);
                }}
                onConfirm={() => {
                    if (fileToRemove) handleRemoveFile(fileToRemove);
                }}
                title="Remove Document"
                description="Are you sure you want to remove this document?"
                confirmText="Remove"
                isLoading={isRemoving}
                variant="destructive"
            />
        </form>
    );
}
