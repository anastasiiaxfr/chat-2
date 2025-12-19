import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import Header from "./chat-header";
import Footer from "./chat-footer";
import Auth from "./auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);

    console.log(currentUser);

    //if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <div className="bg-gray-950 p-2 lg:p-10 flex-1 flex flex-col justify-center">
            {currentUser ? (
                <div className="relative max-w-4xl w-full lg:my-10 mx-auto bg-gray-800 text-white overflow-hidden rounded-2xl">
                    <SidebarProvider>
                        <AppSidebar />
                        <main className="p-4 w-full flex flex-col">
                            <Header />
                            <div className="px-10 mb-10 overflow-y-auto">
                                {children}
                            </div>
                            <Footer />
                        </main>
                    </SidebarProvider>
                </div>
            ) : (
                <Auth />
            )}
            <ToastContainer />
        </div>
    );
}
