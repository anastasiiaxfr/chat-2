import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function ChatFooter() {
    return (
        <div className="chat-footer">
            <Button size="icon" aria-label="Delete">
                <ImageUp />
            </Button>
            <Textarea
                placeholder="Type your message here."
                className="border-white/20 bg-gray-700 max-h-40"
                rows="5"
            />
            <Button>Send</Button>
        </div>
    );
}

export default ChatFooter;
