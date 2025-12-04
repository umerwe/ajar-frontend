import { useCreateChat, useGetChatList } from '@/hooks/useChat'
import { Chat, Participant } from '@/types/chat'
import { Listing } from '@/types/listing'
import { capitalizeWords } from '@/utils/capitalizeWords'
import { MessageCircleMore, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const HostInfo = ({ property }: { property: Listing }) => {
    const router = useRouter();
    const { mutate } = useCreateChat();
    const { data } = useGetChatList();

    const receiverId = property.leaser._id;

    const existingChat = data?.chats.find((chat: Chat) =>
        chat.participants.some((p: Participant) => p._id === receiverId)
    );

    const chatExists = Boolean(existingChat?._id);

    function handleClick() {
        try {
            if (chatExists) {
                router.push(`/chat?id=${existingChat._id}`);
                return;
            }
            mutate(
                { receiverId },
                {
                    onSuccess: (data) => {
                        router.push(`/chat?id=${data?._id}`);
                    }
                }
            );
        }
        catch {
            console.log("Error creating chat");
        }
    }

    return (
        <div className="my-10 (mt-2) (md:-mt-12)">
            <div className="flex items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Hosted by</h3>
            </div>
            <div className="flex items-center justify-between max-w-100 space-x-3">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                            src="/host-img.png"
                            alt={property?.leaser?.name || "Host profile image"}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-base xl:text-lg">
                            {capitalizeWords(property.leaser.name)}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {4.8} ({200} reviews)
                        </p>
                    </div>
                </div>
                <div
                    onClick={handleClick}
                    className="border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue flex items-center justify-center mb-2 w-10 h-10 rounded-md cursor-pointer">
                    <MessageCircleMore className="w-5.5 h-5.5 text-aqua" />
                </div>
            </div>
        </div>
    );
}

export default HostInfo;
