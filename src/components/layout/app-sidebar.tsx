import { useState } from "react";
import { User2, ChevronDown, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarHeader,
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ChatList from "./chat-list";
import AddUserModal from "./chat-add-user-modal";
import { useUserStore } from "../../lib/userStore";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export function AppSidebar() {
    const { currentUser } = useUserStore();
    const [search, setSearch] = useState("");

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Sidebar className="absolute border-blue-800 h-full">
            <SidebarHeader className="bg-blue-800 text-white">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="relative !h-auto">
                            <div className="chat-user-avatar">
                                {currentUser?.avatar ? (
                                    <img
                                        className="object-cover w-12 h-12 min-w-12 rounded-full"
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
                            <ChevronDown className="ml-auto absolute right-2 top-4 bottom-0" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-full border-0 p-0"
                    >
                        <Button
                            onClick={handleLogout}
                            className="bg-transparent text-black w-full hover:bg-blue-700 hover:text-white"
                        >
                            Log out
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="chatt-add-user border-y border-white/20 py-4">
                    <div className="flex w-full max-w-sm items-center gap-2">
                        <InputGroup className="border-white/20 flex-1">
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                        <AddUserModal />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="sidabar-content bg-blue-800 text-white flex-1 h-full">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-inherit">
                        Previous Chats
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <ChatList search={search} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
