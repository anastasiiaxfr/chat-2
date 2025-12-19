import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

function ChatFooter() {
    const [text, setText] = useState("");
    const { chatId, user } = useChatStore();
    const { currentUser } = useUserStore();

    console.log("chatId", chatId);

    const handleSend = async () => {
        if (!text.trim() || !chatId || !currentUser?.id || !user?.id) {
            console.error("Cannot send — missing user or chat info", {
                text,
                chatId,
                currentUser,
                otherUser: user,
            });
            return;
        }

        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text: text.trim(),
                    createdAt: Date.now(),
                }),
            });

            const userIDs = [currentUser.id, user.id];
            for (const id of userIDs) {
                const userChatRef = doc(db, "userchats", id);
                const userChatSnapshot = await getDoc(userChatRef);

                if (userChatSnapshot.exists()) {
                    const userChatData = userChatSnapshot.data();
                    const chatIndex = userChatData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );

                    if (chatIndex !== -1) {
                        userChatData.chats[chatIndex].lastMessage = text.trim();
                        userChatData.chats[chatIndex].updatedAt = Date.now();
                        userChatData.chats[chatIndex].isSeen =
                            id === currentUser.id;

                        await updateDoc(userChatRef, {
                            chats: userChatData.chats,
                        });
                    }
                }
            }

            setText("");
        } catch (err) {
            console.error("Send message failed:", err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-footer flex gap-2 p-2">
            <Textarea
                placeholder="Type your message here."
                className="border-white/20 bg-gray-700 max-h-40 flex-1 resize-none p-2 rounded"
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSend}>Send</Button>
        </div>
    );
}

export default ChatFooter;
