import { UserRound, Plus, User2, ChevronDown, SearchIcon } from "lucide-react";
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
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "../../lib/userStore";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export function AppSidebar() {
    const { currentUser } = useUserStore();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Sidebar className="absolute border-blue-800 h-full ">
            <SidebarHeader className="bg-blue-800 text-white ">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="relative !h-auto focus:appearance-none focus:outline-0 focus:border-0 focus:shadow-none focus-within:shadow-none">
                            <div className="chat-user-avatar">
                                {currentUser?.avatar ? (
                                    <img
                                        className="object-cover w-14 h-14 min-w-14 rounded-full"
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
                        <InputGroup className="border-white/20">
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                            <InputGroupInput placeholder="Search..." />
                        </InputGroup>
                        <Button type="submit">
                            <Plus />
                        </Button>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="sidabar-content bg-blue-800 text-white flex-1 h-full">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-inherit">
                        Previous Chats
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-4 grid gap-4">
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#" className="chat-user-list">
                                        {/* <img
                                    src=""
                                    alt=""
                                    width="30"
                                    height="30"
                                    className="chat-user-list-avatar"
                                /> */}
                                        <div className="chat-user-list-avatar">
                                            <UserRound />
                                        </div>
                                        <div>
                                            <p className="chat-user-list-title">
                                                John Doe
                                            </p>
                                            <p className="chat-user-list-description">
                                                Lorem ipsum dolor sit amet.
                                            </p>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#" className="chat-user-list">
                                        {/* <img
                                    src=""
                                    alt=""
                                    width="30"
                                    height="30"
                                    className="chat-user-list-avatar"
                                /> */}
                                        <div className="chat-user-list-avatar">
                                            <UserRound />
                                        </div>
                                        <div>
                                            <p className="chat-user-list-title">
                                                John Doe
                                            </p>
                                            <p className="chat-user-list-description">
                                                Lorem ipsum dolor sit amet.
                                            </p>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#" className="chat-user-list">
                                        {/* <img
                                    src=""
                                    alt=""
                                    width="30"
                                    height="30"
                                    className="chat-user-list-avatar"
                                /> */}
                                        <div className="chat-user-list-avatar">
                                            <UserRound />
                                        </div>
                                        <div>
                                            <p className="chat-user-list-title">
                                                John Doe
                                            </p>
                                            <p className="chat-user-list-description">
                                                Lorem ipsum dolor sit amet.
                                            </p>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#" className="chat-user-list">
                                        {/* <img
                                    src=""
                                    alt=""
                                    width="30"
                                    height="30"
                                    className="chat-user-list-avatar"
                                /> */}
                                        <div className="chat-user-list-avatar">
                                            <UserRound />
                                        </div>
                                        <div>
                                            <p className="chat-user-list-title">
                                                John Doe
                                            </p>
                                            <p className="chat-user-list-description">
                                                Lorem ipsum dolor sit amet.
                                            </p>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#" className="chat-user-list">
                                        {/* <img
                                    src=""
                                    alt=""
                                    width="30"
                                    height="30"
                                    className="chat-user-list-avatar"
                                /> */}
                                        <div className="chat-user-list-avatar">
                                            <UserRound />
                                        </div>
                                        <div>
                                            <p className="chat-user-list-title">
                                                John Doe
                                            </p>
                                            <p className="chat-user-list-description">
                                                Lorem ipsum dolor sit amet.
                                            </p>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
