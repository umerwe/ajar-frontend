import Image from "next/image"

const Brand = () => {
    return (
        <div className="flex items-center space-x-2">
            <Image
                src="/ajar-logo.png"
                alt="Logo"
                width={100}
                height={40}
                priority
            />
        </div>
    )
}

export default Brand
