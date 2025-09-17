import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function CongratulationsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-auth p-4">
            <div className="max-w-sm w-full rounded-md mx-auto text-center bg-white px-4 pt-3 pb-8">
                {/* Congratulations Image */}
                <div className="mb-8 flex justify-center">
                    <Image
                        src="/congratulations-img.png"
                        alt="Congratulations illustration"
                        width={200}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-black mb-1">Congratulations!</h1>
                    <p className="text-gray-custom text-sm max-w-50 m-auto">
                        Your Account Has been successfully created
                    </p>
                </div>

                {/* Login Button */}
                <Link
                    href="/login">
                    <Button variant='destructive' className ="w-full">
                        Log In
                    </Button>
                </Link>
            </div>
        </div>
    );
}