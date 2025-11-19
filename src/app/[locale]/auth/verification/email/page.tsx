import EmailVerificationForm from "@/components/forms/email-verification-form";
import AuthLayout from "@/components/auth/auth-layout"

const EmailVerification = () => {
    return <AuthLayout FormComponent={<EmailVerificationForm />} />
}

export default EmailVerification
