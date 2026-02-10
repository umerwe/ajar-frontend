import { LoginDialog } from '@/components/dialogs/login-dialog'
import { useUser } from '@/hooks/useAuth'
import { useCreateChat, useGetChatList } from '@/hooks/useChat'
import { Chat, Participant } from '@/types/chat'
import { Listing } from '@/types/listing'
import { capitalizeWords } from '@/utils/capitalizeWords'
import { MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const HostInfo = ({ property }: { property: Listing }) => {
    const router = useRouter();
    const { data: user } = useUser();
    const { mutate } = useCreateChat();
    const { data } = useGetChatList();
    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);

    const receiverId = property.leaser._id;

    const existingChat = data?.chats.find((chat: Chat) =>
        chat.participants.some((p: Participant) => p._id === receiverId)
    );

    const chatExists = Boolean(existingChat?._id);

    function handleClick() {
        if (!data) {
            setIsGuestDialogOpen(true);
            return;
        }
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

    const hostName = property?.leaser?.name || "";
    const hostInitial = hostName.charAt(0).toUpperCase();

    const profilePicture = property?.leaser?.profilePicture;
    const imageSrc =
        profilePicture?.startsWith("/uploads/")
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${profilePicture}`
            : profilePicture

    return (
        <div>
            <div className="flex items-center mb-[20px]">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Hosted by</h2>
            </div>
            <div className="flex items-center justify-between max-w-100 space-x-3">
                <div className="flex gap-3">
                    {/* Updated Image Logic */}
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        {property.leaser.profilePicture ? (
                            <Image
                                src={imageSrc}
                                alt={hostName || "Host profile image"}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-aqua flex items-center justify-center text-white font-bold text-lg">
                                {hostInitial}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="font-semibold text-gray-800 text-sm xl:text-base">
                            {capitalizeWords(property.leaser.name)}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm flex items-center sm:-mt-0.5">
                            {property?.leaser?.email}
                        </p>
                    </div>
                </div>
                {
                    user?.email !== property?.leaser?.email &&
                    <div
                        onClick={handleClick}
                        className="border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue flex items-center justify-center mb-2 w-10 h-10 rounded-md cursor-pointer">
                        <MessageCircleMore className="w-5.5 h-5.5 text-aqua" />
                    </div>
                }

            </div>
            <LoginDialog
                open={isGuestDialogOpen}
                onOpenChange={setIsGuestDialogOpen}
            />
        </div>
    );
}

export default HostInfo;