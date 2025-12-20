import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";

function ChatHeader() {
    const { currentUser } = useUserStore();
    const { chatId } = useChatStore();
    const [displayUser, setDisplayUser] = useState(null);

    useEffect(() => {
        if (!chatId || !currentUser) return;

        const fetchOtherUser = async () => {
            try {
                // Get the chat document
                const chatSnap = await getDoc(doc(db, "chats", chatId));
                if (!chatSnap.exists()) return;

                const { members } = chatSnap.data();

                // Find the other user (not current)
                const otherUserId = members.find((id) => id !== currentUser.id);
                if (!otherUserId) return;

                // Get the other user data
                const userSnap = await getDoc(doc(db, "users", otherUserId));
                if (userSnap.exists()) {
                    setDisplayUser(userSnap.data());
                }
            } catch (err) {
                console.error("Failed to fetch chat user:", err);
            }
        };

        fetchOtherUser();
    }, [chatId, currentUser]);

    return (
        <div className="chat-header flex items-center p-2">
            <SidebarTrigger />
            {displayUser?.username && (
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
                        <p className="my-0 font-medium">
                            {displayUser?.username || "Username"}
                        </p>
                        <p className="text-xs my-0 opacity-50">
                            {displayUser?.email || ""}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatHeader;
