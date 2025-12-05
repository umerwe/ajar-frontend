import Image from "next/image"
import Link from "next/link"

const Brand = () => {
    return (
        <Link
            href="/"
            className="flex items-center space-x-2">
            <Image
                src="/ajar-logo.png"
                alt="Logo"
                width={100}
                height={40}
                priority
            />
        </Link>
    )
}

export default Brand
