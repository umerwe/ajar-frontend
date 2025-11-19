"use client"
import Header from "@/components/pages/listing-details/header"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

const RentalHistory = () => {
    const router = useRouter()
    return (
        <div className="px-3 sm:px-7">
            <Header
                title="Rental History"
            />
            <div className="flex flex-col justify-start items-center gap-2 text-center">
                <Image
                    src="/rental-img.png"
                    alt="rental-history-img"
                    width={300}
                    height={300}
                />

                <h1 className="font-semibold text-xl -mt-3">No Saved Rental found</h1>
                <p className="text-gray-500 text-sm mb-5">No Saved Rental found. Please try again.</p>
                <Button variant="destructive"
                    className="w-40"
                    onClick={() => router.back()}
                >
                    Go Back
                </Button>
            </div>
        </div>
    )
}

export default RentalHistory
