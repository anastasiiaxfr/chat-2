import { SidebarTrigger } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";

function ChatHeader() {
    return (
        <div className="chat-header">
            <SidebarTrigger />
            <div className="grid gap-2 items-center grid-cols-[40px_1fr]">
                <div className="rounded-full w-10 h-10 min-w-10 bg-blue-700 text-blue-400 not-only-of-type:flex items-center justify-center">
                    <User2 />
                </div>
                <div>
                    <p className="my-0">jane Doe</p>
                    <p className="text-xs my-0 opacity-50">
                        jane.doe@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
