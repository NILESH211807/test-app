/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { EyeOffIcon } from "lucide-react";
import { Eye } from 'lucide-react';
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/graphql/mutations/auth";
import { GET_ME } from "@/graphql/query/user";
import LoginPermission from "@/components/LoginPermission";

// Type for login response
interface LoginResponse {
    login: {
        isPermissionAllowed: boolean;
    };
}

// Validation Schema
const formSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});

export default function Login() {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isLoginPermissionOpen, setIsLoginPermissionOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const AUTHENTICATION_ACTIVE = import.meta.env.VITE_AUTHENTICATION_ACTIVE === "true";

    // const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    // const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

    // const { data } = useFetchAuthorizeQuery({
    //     client_id: CLIENT_ID,
    //     redirect_uri: REDIRECT_URI
    // });

    // const requestedScopes = data?.requestedScopes || [];

    // console.log(requestedScopes)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    const [mutation, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
        onCompleted: (response) => {
            const isPermissionAllowed = response?.login?.isPermissionAllowed || false;
            if (!isPermissionAllowed && AUTHENTICATION_ACTIVE) {
                setIsLoginPermissionOpen(true);
            } else {
                toast.success("Login successful");
                navigate("/", { replace: true });
            }
        },
        onError: (error: any) => {
            const message = error?.message || "Something went wrong";
            toast.error(message);
        },
        refetchQueries: [GET_ME]
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation({
            variables: {
                email: values.email,
                password: values.password
            }
        });
    }

    // throw new Error("Crash Test");

    return (
        <div className="container mx-auto relative min-h-screen flex items-center justify-center">
            <div className="w-full p-4 lg:p-8 h-full flex items-center justify-center">
                <div className="flex w-full flex-col justify-center sm:w-[400px]">
                    <Card className="border-none shadow-none lg:shadow-sm lg:border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-semibold tracking-tight">Login</CardTitle>
                            <CardDescription>Enter your details below to login</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name@example.com" type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="max-w-sm">
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            {...field}
                                                            id="password"
                                                            type={isPasswordVisible ? "text" : "password"}
                                                            placeholder="Enter password"
                                                        />
                                                        <InputGroupAddon align="inline-end" className="cursor-pointer">
                                                            {isPasswordVisible ? (
                                                                <EyeOffIcon onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
                                                            ) : (
                                                                <Eye onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
                                                            )
                                                            }
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end -my-0.5">
                                        <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot Password?</Link>
                                    </div>

                                    <Button disabled={loading} className="w-full mt-2 cursor-pointer" type="submit">
                                        {loading ? "Loading..." : "Login"}
                                    </Button>
                                </form>
                            </Form>
                            <div>
                                <p className='text-center text-sm mt-3'>Don't have an account? <Link to="/signup" className='text-indigo-600 font-semibold'>Signup</Link></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {
                isLoginPermissionOpen && <LoginPermission
                    isLoginPermissionOpen={isLoginPermissionOpen}
                    setIsLoginPermissionOpen={setIsLoginPermissionOpen}
                />
            }
        </div>
    );
}