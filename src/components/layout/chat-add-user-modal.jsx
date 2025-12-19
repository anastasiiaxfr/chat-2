import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Plus, Minus, User2, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { useUserStore } from "../../lib/userStore";
import { auth, db } from "../../lib/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

export default function AddUserModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [searchError, setSearchError] = useState("");
    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchError("");
        setUser(null);

        const formData = new FormData(e.target);
        const username = formData.get("username").trim();

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            } else {
                setSearchError("User not found");
            }
        } catch (err) {
            console.error("Search failed:", err);
            setSearchError("Error searching for user");
        }
    };

    const handleAddUser = async () => {
        if (!user) return;

        try {
            const currentUserChatsDoc = await getDoc(
                doc(db, "userchats", currentUser.id)
            );
            const otherUserChatsDoc = await getDoc(
                doc(db, "userchats", user.id)
            );

            const currentUserChats = currentUserChatsDoc.exists()
                ? currentUserChatsDoc.data().chats
                : [];
            const otherUserChats = otherUserChatsDoc.exists()
                ? otherUserChatsDoc.data().chats
                : [];

            const existing = currentUserChats.find((chat) =>
                otherUserChats.some(
                    (otherChat) => otherChat.chatId === chat.chatId
                )
            );

            if (existing) {
                console.log("Chat already exists with ID:", existing.chatId);
                return;
            }

            const newChatRef = doc(collection(db, "chats"));
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                members: [currentUser.id, user.id],
                messages: [],
            });

            const chatId = newChatRef.id;

            await updateDoc(doc(db, "userchats", currentUser.id), {
                chats: arrayUnion({
                    chatId,
                    receiverId: user.id,
                    lastMessage: "",
                }),
            });
            await updateDoc(doc(db, "userchats", user.id), {
                chats: arrayUnion({
                    chatId,
                    receiverId: currentUser.id,
                    lastMessage: "",
                }),
            });

            console.log("Created new chat:", chatId);
        } catch (err) {
            console.error("Error adding user:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button">{isOpen ? <Minus /> : <Plus />}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                </DialogHeader>

                <form className="grid gap-3" onSubmit={handleSearch}>
                    <InputGroup>
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                            placeholder="Search..."
                            name="username"
                        />
                    </InputGroup>

                    <Button type="submit">Search</Button>
                </form>

                {searchError && <p className="text-xs mt-2">{searchError}</p>}

                {user && (
                    <div className="flex gap-3 justify-between mt-4">
                        <div className="chat-user-avatar">
                            {user.avatar ? (
                                <img
                                    className="object-cover w-12 h-12 min-w-12 rounded-full"
                                    src={user.avatar}
                                    alt={user.username}
                                />
                            ) : (
                                <User2 />
                            )}
                        </div>
                        <div className="mr-auto">
                            <p className="my-0">{user.username}</p>
                            <p className="text-xs opacity-50">{user.email}</p>
                        </div>
                        <DialogClose asChild>
                            <Button onClick={handleAddUser}>Add User</Button>
                        </DialogClose>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
