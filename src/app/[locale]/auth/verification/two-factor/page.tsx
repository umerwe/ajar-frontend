import AuthLayout from "@/components/auth/auth-layout"
import TwoFactorVerificationForm from "@/components/forms/2factor";
import { getLocalizedMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return getLocalizedMetadata(locale, "twoFactorVerification");
}

const TwoFactorVerification = () => {
    return <AuthLayout FormComponent={<TwoFactorVerificationForm />} />
}

export default TwoFactorVerification;
