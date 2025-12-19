import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { auth, db } from "../../lib/firebase";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { toast } from "react-toastify";

const provider = new GoogleAuthProvider();

function AuthPage() {
    const [tab, setTab] = useState("login");
    const registerFormRef = useRef();

    const handleLogin = (e) => {
        e.preventDefault();
        toast.info("Login feature not implemented yet");
    };

    const handleRegisterWithGoogle = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            const email = user.email;
            const uid = user.uid;
            const usernameFromGoogle = user.displayName || "";
            const avatarUrl = user.photoURL || "";

            await setDoc(doc(db, "users", uid), {
                username: usernameFromGoogle,
                email: email,
                id: uid,
                avatar: avatarUrl,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", uid), {
                chats: [],
            });
            toast.success("Signed in with Google!");
            if (registerFormRef.current) {
                registerFormRef.current.reset();
            }
        } catch (error) {
            toast.error("Google sign-in failed: " + error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success("Registered successfully!");
            if (registerFormRef.current) {
                registerFormRef.current.reset();
            }
        } catch (err) {
            toast.error("Registration failed: " + err.message);
        }
    };

    return (
        <div className="p-10 text-center">
            <a href="#" className="mx-auto text-white font-semibold mb-2 block">
                XFR Chat
            </a>

            <Tabs
                defaultValue="login"
                value={tab}
                onValueChange={setTab}
                className="max-w-[400px] mx-auto"
            >
                <TabsList className="mx-auto">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* LOGIN TAB */}
                <TabsContent value="login">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login
                            </CardDescription>
                            <CardAction className="hidden sm:block">
                                <Button
                                    variant="link"
                                    onClick={() => setTab("register")}
                                >
                                    Sign Up
                                </Button>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-2">
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleRegisterWithGoogle}
                                    >
                                        Login with Google
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* REGISTER TAB */}
                <TabsContent value="register">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Register new account</CardTitle>
                            <CardDescription>
                                Enter your details below
                            </CardDescription>
                            <CardAction className="hidden sm:block">
                                <Button
                                    variant="link"
                                    onClick={() => setTab("login")}
                                >
                                    Sign In
                                </Button>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <form
                                onSubmit={handleRegister}
                                ref={registerFormRef}
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-2">
                                    <Button type="submit" className="w-full">
                                        Register
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleRegisterWithGoogle}
                                    >
                                        Register with Google
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AuthPage;
