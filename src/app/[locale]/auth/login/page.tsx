import AuthLayout from "@/components/auth/auth-layout"
import LoginForm from "@/components/forms/login-form";
import { getLocalizedMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getLocalizedMetadata(locale, "login");
}

export default function LoginPage() {
  return <AuthLayout
    FormComponent={<LoginForm />}
    isVerfication={false}
  />
}
