import AuthLayout from "@/components/auth/auth-layout"
import ForgotPasswordForm from "@/components/forms/forgot-password";
import { getLocalizedMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return getLocalizedMetadata(locale, "forgotPassword");
}

const ForgotPassword = () => {
    return <AuthLayout
        FormComponent={<ForgotPasswordForm />}
    />
}

export default ForgotPassword
