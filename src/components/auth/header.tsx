import { HeaderProps } from "@/types/auth"

const AuthHeader = ({ title, description, className = "mb-6" }: HeaderProps) => {
    return (
        <div className={`${className} text-center`}>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-custom text-sm">{description}</p>
        </div>
    )
}

export default AuthHeader
