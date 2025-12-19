import { formatDateTime } from "../../utils/index";
import { Trash2, PencilLine, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

export default function ChatMessages() {
    const endRef = useRef(null);
    const [chat, setChat] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const { chatId } = useChatStore();
    const { currentUser } = useUserStore();

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

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

    if (!chatId) {
        return <p className="mt-10 text-xs opacity-50">No messages yet...</p>;
    }

    const handleDelete = async (message) => {
        if (!chatId) return;
        try {
            const updatedMessages = chat.messages.filter(
                (m) => m.createdAt !== message.createdAt
            );
            await updateDoc(doc(db, "chats", chatId), {
                messages: updatedMessages,
            });
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const handleEdit = (message) => {
        setEditingMessageId(message.createdAt);
        setEditingText(message.text);
    };

    const handleSaveEdit = async (message) => {
        if (!chatId) return;
        try {
            const updatedMessages = chat.messages.map((m) =>
                m.createdAt === message.createdAt
                    ? { ...m, text: editingText }
                    : m
            );
            await updateDoc(doc(db, "chats", chatId), {
                messages: updatedMessages,
            });
            setEditingMessageId(null);
            setEditingText("");
        } catch (err) {
            console.error("Failed to edit message:", err);
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingText("");
    };

    return (
        <div className="chat-messages flex flex-col gap-2 p-2">
            {chat?.messages?.map((message) => {
                const isMine = message.senderId === currentUser?.id;
                const isEditing = editingMessageId === message.createdAt;
                const createdAt = message.createdAt?.toDate?.() || new Date();

                return (
                    <div
                        key={message?.createdAt || Math.random()}
                        className={`chat-message max-w-[70%] rounded-xl break-words 
                            ${
                                isMine ? " self-end bg-black/10" : " self-start"
                            }`}
                    >
                        {isEditing ? (
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setEditingText(e.target.value)
                                    }
                                    className="border p-1 rounded flex-1 text-white"
                                />
                                <Button
                                    size="icon"
                                    onClick={() => handleSaveEdit(message)}
                                    aria-label="Save"
                                >
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handleCancelEdit}
                                    aria-label="Cancel"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p>{message.text}</p>
                                {isMine && (
                                    <div className="chat-message-meta">
                                        <div className="flex gap-1 items-center justify-end mt-1">
                                            <Button
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(message)
                                                }
                                                aria-label="Edit"
                                            >
                                                <PencilLine className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(message)
                                                }
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs opacity-50 mt-1">
                                            {formatDateTime(createdAt)}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        <div ref={endRef}></div>
                    </div>
                );
            })}
        </div>
    );
}
