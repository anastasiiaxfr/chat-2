import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function auth() {
    const [tab, setTab] = useState("login");

    return (
        <div class="p-10 text-center">
            <a href="#" className="mx-auto text-white font-semibold mb-2 block">
                XFR Chat
            </a>
            <Tabs
                defaultValue="login"
                className="max-w-[400px]  mx-auto"
                value={tab}
                onValueChange={setTab}
            >
                <TabsList className="mx-auto">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card className="w-full max-w-sm">
                        <CardHeader className="text-left !grid-cols-1 sm:grid-cols_[1_auto]">
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
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
                            <form>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Google
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card className="w-full max-w-sm">
                        <CardHeader className="text-left !grid-cols-1 sm:grid-cols_[1_auto]">
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to register to your
                                account
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
                            <form>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                            <Button variant="outline" className="w-full">
                                Reister with Google
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default auth;
