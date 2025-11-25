import React from 'react'
import { useUser } from '@/hooks/useAuth';
import { useGetUserDocument } from '@/hooks/useDocument';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import EditProfileForm from '@/components/forms/edit-profile';
import { ChevronRight, Pencil } from 'lucide-react';

const ProfileDialog = () => {
    const { data: user = [], isLoading, isError } = useUser();
    const { data: documents = [], isLoading: documentsLoading } = useGetUserDocument();
    const [file, setFile] = React.useState<File | null>(null);
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-aqua" />
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-6 w-6 text-aqua" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 px-1">
                    {/* Profile Upload with Preview */}
                    <div className="flex justify-center mb-4">
                        <div className="relative group h-24 w-24 rounded-full overflow-hidden bg-header flex items-center justify-center text-white text-2xl font-semibold">
                            {file ? (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="New preview"
                                    fill
                                    className="object-cover object-center"
                                />
                            ) : user?.profilePicture ? (
                                <Image
                                    src={process.env.NEXT_PUBLIC_API_BASE_URL + user?.profilePicture}
                                    alt={user?.name || "User"}
                                    fill
                                    className="object-cover object-center"
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                            )}

                            {/* Edit Icon Overlay */}
                            <label
                                htmlFor="profile-upload"
                                className="absolute bottom-0 right-0 bg-white text-blue p-2 rounded-full shadow-md cursor-pointer opacity-90 hover:opacity-100 transition"
                            >
                                <Pencil className="h-4 w-4" />
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    if (selectedFile) {
                                        setFile(selectedFile);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <EditProfileForm
                        file={file}
                        setOpen={setOpen}
                        documents={documents}
                        documentsLoading={documentsLoading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProfileDialog