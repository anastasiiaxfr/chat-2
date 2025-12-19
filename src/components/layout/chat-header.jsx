import { SidebarTrigger } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";

function ChatHeader() {
    const { currentUser } = useUserStore();
    const { user: chatUser } = useChatStore();
    const displayUser = chatUser || currentUser;

    return (
        <div className="chat-header flex items-center p-2">
            <SidebarTrigger />
            <div className="grid gap-2 items-center grid-cols-[40px_1fr]">
                <div className="rounded-full w-10 h-10 min-w-10 bg-blue-700 text-blue-400 flex items-center justify-center overflow-hidden">
                    {displayUser?.avatar ? (
                        <img
                            className="object-cover w-10 h-10 rounded-full"
                            src={displayUser.avatar}
                            alt={displayUser.username}
                        />
                    ) : (
                        <User2 />
                    )}
                </div>
                <div>
                    <p className="my-0 font-medium">{displayUser.username}</p>
                    <p className="text-xs my-0 opacity-50">
                        {displayUser.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
