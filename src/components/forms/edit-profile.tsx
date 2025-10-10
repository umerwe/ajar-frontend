import { useForm } from "react-hook-form";
import AuthInput from "../fields/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";
import { EditProfile } from "@/types/auth";
import React from "react";

interface Props {
    file: File | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    documents: Document[];
    documentsLoading?: boolean;
}

export default function EditProfileForm({
    file,
    setOpen,
    documents = [],
    documentsLoading = false,
}: Props) {
    const { mutate, isPending } = useUpdateUser();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            email: "",
            dob: "",
            nationality: "",
        },
    });

    const [docFiles, setDocFiles] = React.useState<{ [key: string]: File | null }>({});

    const onSubmit = (data: EditProfile) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
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
            <AuthInput label="Name" placeholder="Enter your name" type="text" register={register("name")} />
            <AuthInput label="Email" placeholder="Enter your email" type="email" register={register("email")} />
            <AuthInput label="Date of Birth" type="date" register={register("dob")} />
            <AuthInput label="Nationality" placeholder="Enter your country" type="text" register={register("nationality")} />

            {!documentsLoading && documents.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Upload Documents
                    </h3>
                    {documents.map((doc: Document) => (
                        <div key={doc.value} className="mb-4">
                            <label
                                htmlFor={doc.value}
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {doc.name}
                            </label>

                            <input
                                id={doc.value}
                                type="file"
                                accept="image/*,.pdf"
                                className="block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-aqua focus:outline-none"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0] || null;
                                    handleDocChange(doc.value, selectedFile);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <Button variant="destructive" className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}