import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";
import React from "react";
import Image from "next/image";
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Loader from "../common/loader";
import { formatFileSize } from "@/utils/formatFileSize";
import { EditProfileFormValues, EditProfileSchema } from "@/validations/profile";
import { toast } from "../ui/toast";


export default function EditProfileForm({
    file,
    setOpen,
    documents = [],
    user
}: ProfileProps) {
    const { mutate, isPending } = useUpdateUser();

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
                        Upload Documents
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

                                {doc?.filesUrl?.length !== 0 && (
                                    <div className="mb-2">
                                        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                                            {doc.filesUrl?.map((url: string, index: number) => (
                                                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0">
                                                    {url.endsWith(".pdf") ? (
                                                        <div className="flex items-center justify-center h-full bg-gray-200 text-sm text-gray-600">PDF</div>
                                                    ) : (
                                                        <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + url} alt="preview" fill className="object-cover" />
                                                    )}
                                                </div>
                                            ))}
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

                                {docFiles[doc.name] ? (
                                    <div className="flex items-center justify-between p-2 bg-white border-2 border-blue-500 rounded-lg">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {docFiles[doc.name]!.type.startsWith('image/') ? (
                                                <Image src={URL.createObjectURL(docFiles[doc.name]!)} alt="Preview" width={40} height={40} className="w-10 h-10 object-cover rounded" />
                                            ) : (
                                                <File className="w-5 h-5 text-blue-500" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">{docFiles[doc.name]!.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(docFiles[doc.name]!.size)}</p>
                                            </div>
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <button type="button" onClick={() => handleDocChange(doc.name, null)} className="ml-2 p-1"><X className="w-4 h-4 text-gray-500" /></button>
                                    </div>
                                ) : (
                                    <label htmlFor={`file-${doc.name}`} className="flex items-center justify-center gap-2 p-3 border-2 mt-4 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <div className="text-center">
                                            <p className="text-xs font-medium text-gray-700">Click to upload new file</p>
                                            <p className="text-xs text-gray-500">PDF or Image</p>
                                        </div>
                                    </label>
                                )}
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