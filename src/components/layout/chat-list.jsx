import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../../lib/chatStore";

function ChatList({ search }) {
    const [chats, setChats] = useState([]);
    const { currentUser } = useUserStore();
    const { changeChat } = useChatStore();

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "userchats", currentUser.id),
            async (res) => {
                const items = res.data()?.chats || [];

                const promises = items.map(async (item) => {
                    const userDocRef = doc(db, "users", item.receiverId);
                    const userDocSnap = await getDoc(userDocRef);
                    const user = userDocSnap.data();
                    return { ...item, user };
                });

                const chatData = await Promise.all(promises);

                setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        );

        return () => unSub();
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );
        if (chatIndex !== -1) userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, { chats: userChats });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };

    // Filter chats by search term
    const filteredChats = chats.filter(
        (chat) =>
            chat.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
            chat.lastMessage?.toLowerCase().includes(search.toLowerCase())
    );

    {
        filteredChats.length < 1 && (
            <p className="px-2 opacity-50 text-xs">No chats found…</p>
        );
    }

    return (
        <SidebarMenu className="mt-4 grid gap-4">
            {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <SidebarMenuItem
                        key={chat.chatId}
                        onClick={() => handleSelect(chat)}
                        className={`${
                            chat.isSeen ? "bg-transparent" : "bg-blue-400"
                        } rounded-xl`}
                    >
                        <SidebarMenuButton asChild>
                            <a
                                href="#"
                                className="chat-user-list flex items-center gap-2"
                            >
                                <div className="chat-user-list-avatar">
                                    {chat.user?.avatar ? (
                                        <img
                                            src={chat.user.avatar}
                                            alt={chat.user.username}
                                            className="rounded-full w-10 h-10"
                                        />
                                    ) : (
                                        <UserRound />
                                    )}
                                </div>
                                <div>
                                    <p className="chat-user-list-title">
                                        {chat.user.username}
                                    </p>
                                    <p className="chat-user-list-description text-xs opacity-50">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))
            ) : (
                <p className="text-xs opacity-50 px-2">
                    No chats availabel yet...
                </p>
            )}
        </SidebarMenu>
    );
}

export default ChatList;
