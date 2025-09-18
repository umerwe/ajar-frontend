import { useForm } from "react-hook-form";
import AuthInput from "../fields/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";

export default function EditProfileForm({ file }: { file: File | null }) {
    const { mutate } = useUpdateUser();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            email: "",
            dob: "",
            nationality: "",
        },
    });

    const onSubmit = (data: any) => {
        const formData = new FormData();

        // Sirf filled fields bhejo
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.dob) formData.append("dob", data.dob);
        if (data.nationality) formData.append("nationality", data.nationality);

        if (file) {
            formData.append("profilePicture", file);
        }

        // Debugging ke liye
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        mutate(formData); // backend ko bhejna
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
                label="Name"
                placeholder="Enter your name"
                type="text"
                register={register("name")}
            />
            <AuthInput
                label="Email"
                placeholder="Enter your email"
                type="email"
                register={register("email")}
            />
            <AuthInput label="Date of Birth" type="date" register={register("dob")} />
            <AuthInput
                label="Nationality"
                placeholder="Enter your country"
                type="text"
                register={register("nationality")}
            />
            <Button variant="destructive" className="w-full">
                Save Changes
            </Button>
        </form>
    );
}
