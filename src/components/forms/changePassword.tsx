"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/auth-input";
import Button from "../auth/button";
import { useChangePassword } from "@/hooks/useAuth";
import { ChangePassword, ChangePasswordSchema } from "@/validations/auth";
import { useTranslations } from "next-intl";

interface ChangePasswordFormProps {
    setOpen: (open: boolean) => void;
}

const ChangePasswordForm = ({ setOpen }: ChangePasswordFormProps) => {
    const { mutateAsync, isPending } = useChangePassword();
    const t = useTranslations("translation");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePassword>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (formData: ChangePassword) => {
        await mutateAsync(formData);
        setOpen(false);
    };

    return (
        <div className="bg-white rounded-md py-2 w-full lg:w-[400px]">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t("oldPassword")}
                    type="password"
                    placeholder={t("enterOldPassword")}
                    register={register("oldPassword")}
                    error={errors.oldPassword?.message}
                />

                <Input
                    label={t("newPassword")}
                    type="password"
                    placeholder={t("enterNewPassword")}
                    register={register("newPassword")}
                    error={errors.newPassword?.message}
                />

                <Input
                    label={t("confirmPassword")}
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    register={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                <Button isPending={isPending} text={t("submit")} className="text-base" />
            </form>
        </div>
    );
};

export default ChangePasswordForm;
