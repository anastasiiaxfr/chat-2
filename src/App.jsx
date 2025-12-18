import Layout from "./components/layout/layout";
import { formatDateTime } from "./utils/index";
import { Trash2, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
    return (
        <Layout>
            <div className="chat-messages">
                <div className="chat-message">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Necessitatibus beatae quisquam doloremque quo,
                        distinctio delectus!
                    </p>
                    <div className="chat-message-meta">
                        <div className="flex gap-2 items-center">
                            <Button size="icon" aria-label="Delete">
                                <Trash2 />
                            </Button>
                            <Button size="icon" aria-label="Delete">
                                <PencilLine />
                            </Button>
                        </div>
                        <p>{formatDateTime(Date.now())}</p>
                    </div>
                </div>

                <div className="chat-message answer">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Necessitatibus beatae quisquam doloremque quo,
                        distinctio delectus!
                    </p>
                    <div className="chat-message-meta">
                        <div className="flex gap-2 items-center">
                            <Button size="icon" aria-label="Delete">
                                <Trash2 />
                            </Button>
                            <Button size="icon" aria-label="Delete">
                                <PencilLine />
                            </Button>
                        </div>
                        <p>{formatDateTime(Date.now())}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
