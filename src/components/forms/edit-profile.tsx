import { useForm } from "react-hook-form";
import AuthInput from "../fields/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";
import { EditProfile } from "@/types/auth";

export default function EditProfileForm({
    file,
    setOpen,
}: {
    file: File | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { mutate, isPending } = useUpdateUser();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            email: "",
            dob: "",
            nationality: "",
        },
    });

    const onSubmit = (data: EditProfile) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.dob) formData.append("dob", data.dob);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (file) formData.append("profilePicture", file);

        mutate(formData, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput label="Name" placeholder="Enter your name" type="text" register={register("name")} />
            <AuthInput label="Email" placeholder="Enter your email" type="email" register={register("email")} />
            <AuthInput label="Date of Birth" type="date" register={register("dob")} />
            <AuthInput label="Nationality" placeholder="Enter your country" type="text" register={register("nationality")} />

            <Button variant="destructive" className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
