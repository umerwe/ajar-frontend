import AuthLayout from "@/components/auth/auth-layout"
import ResetPasswordForm from "@/components/forms/reset-password";
import { getLocalizedMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return getLocalizedMetadata(locale, "resetPassword");
}

const ResetPassword = () => {
    return <AuthLayout
        FormComponent={<ResetPasswordForm />}
    />
}

export default ResetPassword
