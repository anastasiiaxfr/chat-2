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
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { toast } from "react-toastify";

const provider = new GoogleAuthProvider();

function AuthPage() {
    const [tab, setTab] = useState("login");
    const registerFormRef = useRef();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.log(err);
            toast.error(err.message);
            form.reset();
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterWithGoogle = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            if (registerFormRef.current) {
                registerFormRef.current.reset();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginWithGoogle = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const uid = user.uid;

            const userDocRef = doc(db, "users", uid);
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                await signOut(auth);
                toast.error("User not registered. Please sign up first.");
                return;
            }

            toast.success("Logged in with Google!");
        } catch (error) {
            toast.error("Google login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            if (registerFormRef.current) {
                registerFormRef.current.reset();
            }
        } finally {
            setLoading(false);
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
                        <CardHeader className="sm:text-left !grid-cols-1 sm:grid-cols-[1fr_auto]">
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login
                            </CardDescription>
                            <CardAction className="hidden sm:block">
                                <Button
                                    variant="link"
                                    onClick={() => setTab("register")}
                                    disabled={loading}
                                    className="hidden sm:block"
                                >
                                    Sign Up
                                </Button>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleLogin} className="from-login">
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            maxlength="30"
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
                                            maxlength="20"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading" : " Login"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleLoginWithGoogle}
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
                        <CardHeader className="sm:text-left !grid-cols-1 sm:grid-cols-[1fr_auto]">
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
                                className="form-register"
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
                                            maxlength="15"
                                            minlength="2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            maxlength="30"
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
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading" : "Register"}
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
