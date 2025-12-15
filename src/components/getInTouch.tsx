import Image from 'next/image'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { useCreateChat } from '@/hooks/useChat'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

const GetInTouch = () => {
    const router = useRouter();
    const { mutate } = useCreateChat();
    const handleClick = () => {
        mutate(
            {
                receiverId: "685a3e02b9d2819129f6ccc3"
            },
            {
                onSuccess: (data) => {
                    router.push(`/chat?id=${data._id}`)
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Something went wrong",
                        variant: "destructive"
                    })
                }
            }
        );
    };
    return (
        <div className="bg-gray-100 relative mt-10 shrink-0">
            <div className="mx-auto px-4 sm:px-6 lg:px-16 pt-15 pb-10 xl:px-40">
                <Image
                    src={'/help-icon.png'}
                    alt='help-icon'
                    width={40}
                    height={40}
                    className="hidden lg:absolute lg:block bottom-34 left-115 opacity-80"
                />
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="text-center lg:text-left mb-8 lg:mb-0">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600">
                            Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
                        </p>
                    </div>

                    <div className="flex items-center relative">
                        <Button
                            onClick={handleClick}
                            className="bg-white hover:bg-gray-200 text-black px-7 py-6 rounded-md text-base font-medium shadow-sm border border-gray-200">
                            Get in Touch
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <Image
                            src={'/help-icon.png'}
                            alt='help-icon'
                            width={30}
                            height={30}
                            className="lg:absolute top-5 right-60 hidden lg:block opacity-60"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetInTouch