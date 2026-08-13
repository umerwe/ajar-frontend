import AuthLayout from "@/components/auth/auth-layout"
import SignUpForm from "@/components/forms/signup-form"
import { getLocalizedMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getLocalizedMetadata(locale, "signUp");
}

export default function SignUpPage() {
  return <AuthLayout
    FormComponent={<SignUpForm />}
    isVerfication={false}
  />
}
