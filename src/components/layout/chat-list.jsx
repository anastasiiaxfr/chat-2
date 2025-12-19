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

function ChatList() {
    const [chats, setChats] = useState([]);
    const { currentUser } = useUserStore();
    const { changeChat, chatId } = useChatStore();

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "userchats", currentUser.id),
            async (res) => {
                const items = res.data().chats;

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

        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;

            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });

            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <SidebarMenu className="mt-4 grid gap-4">
            {chats.length > 0 ? (
                chats.map((chat) => (
                    <SidebarMenuItem
                        key={chat.chatId}
                        onClick={() => handleSelect(chat)}
                        className={`${
                            chat.isSeen ? "bg-transparent" : "bg-blue-400"
                        } rounded-xl`}
                    >
                        <SidebarMenuButton asChild>
                            <a href="#" className="chat-user-list">
                                <div className="chat-user-list-avatar">
                                    {chat.user?.avatar ? (
                                        <img
                                            src={chat.user?.avatar}
                                            alt={chat.user.username}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <UserRound />
                                    )}
                                </div>
                                <div>
                                    <p className="chat-user-list-title">
                                        {chat.user.username}
                                    </p>
                                    <p className="chat-user-list-description">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))
            ) : (
                <p className="px-2 opacity-50 text-xs">
                    No chats available yet…
                </p>
            )}
        </SidebarMenu>
    );
}

export default ChatList;
