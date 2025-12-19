import { formatDateTime } from "../../utils/index";
import { Trash2, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

export default function ChatMessages() {
    const endRef = useRef(null);
    const [chat, setChat] = useState();
    const { chatId } = useChatStore();
    const { currentUser } = useUserStore();

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    useEffect(() => {
        if (!chatId) return;

        const unsub = onSnapshot(
            doc(db, "chats", chatId),
            (res) => {
                setChat(res.data());
            },
            (error) => {
                console.error("Failed to listen to chat:", error);
            }
        );

        return () => unsub();
    }, [chatId]);

    console.log(chat);

    if (!chatId) {
        return <p className="mt-10 text-xs opacity-50">No messages yet...</p>;
    }

    return (
        <div className="chat-messages">
            {chat?.messages?.map((message) => {
                const isMine = message.senderId === currentUser?.id;
                return (
                    <div
                        className={`chat-message ${
                            isMine ? undefined : "answer"
                        }`}
                        key={message?.createdAt}
                    >
                        <p>{message.text}</p>
                        <div className="chat-message-meta">
                            <div className="flex gap-2 items-center">
                                <Button size="icon" aria-label="Delete">
                                    <Trash2 />
                                </Button>
                                <Button size="icon" aria-label="Delete">
                                    <PencilLine />
                                </Button>
                            </div>
                            <div ref={endRef}></div>
                            <p>{formatDateTime(Date.now())}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
