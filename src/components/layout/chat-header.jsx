import { SidebarTrigger } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";
import { useUserStore } from "../../lib/userStore";

function ChatHeader() {
    const { currentUser } = useUserStore();

    return (
        <div className="chat-header">
            <SidebarTrigger />
            <div className="grid gap-2 items-center grid-cols-[40px_1fr]">
                <div className="rounded-full w-10 h-10 min-w-10 bg-blue-700 text-blue-400 not-only-of-type:flex items-center justify-center">
                    {currentUser?.avatar ? (
                        <img
                            className="object-cover w-10 h-10 rounded-full"
                            src={currentUser?.avatar}
                            alt={currentUser.username}
                        />
                    ) : (
                        <User2 />
                    )}
                </div>
                <div>
                    <p className="my-0">{currentUser.username}</p>
                    <p className="text-xs my-0 opacity-50">
                        {currentUser.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
