import Loader from "../common/loader"
import { Button } from "../ui/button"

interface AuthButtonProps {
    text: string,
    className?: string,
    isPending?: boolean
}

const AuthButton = ({ text, className, isPending }: AuthButtonProps) => {
    return (
        <Button
            variant="destructive"
            disabled={isPending}
            className={`w-full text-white py-5.5 px-4 rounded-full font-semibold
                 hover:from-teal-500 hover:to-teal-600 focus:outline-none 
                 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all 
                 duration-200 text-sm shadow-lg ${className}`}
            type="submit"
        >
            {isPending ? <Loader /> : text}
        </Button>
    )
}

export default AuthButton
