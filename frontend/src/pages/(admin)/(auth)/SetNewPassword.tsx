"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { SET_NEW_PASSWORD } from "@/graphql/mutations/admin";
import { toast } from "sonner";

const passwordSchema = z.object({
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type PasswordValues = z.infer<typeof passwordSchema>;

export default function SetNewPasswordPage() {
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const token = searchParams?.get('token');

    const form = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            token: token || ""
        },
    });

    const [setPassword, { loading }] = useMutation(SET_NEW_PASSWORD, {
        onCompleted: () => {
            toast.success('Password updated successfully');
            navigate('/admin/login', { replace: true });
        },
        onError: (err) => {
            const message = err.message || "Something went wrong."
            toast.error(message)
        }
    })


    function onSubmit(data: PasswordValues) {
        const updated = {
            password: data.password,
            token: data.token
        }
        setPassword({ variables: updated });
        console.log("Password Updated:", updated);
    }

    return (
        <>
            {
                token ? (
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
                            <CardHeader className="space-y-1 text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <LockKeyhole className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Set new password</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground -mt-2">
                                    Your new password must be different from previous used passwords.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        {/* New Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="••••••••"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" disabled={loading} className="w-full mt-3 cursor-pointer">
                                            {loading ? "Loading..." : "Submit"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className='w-full h-screen flex items-center justify-center flex-col'>
                        Invalid Request
                    </div>
                )
            }
        </>
    );
}

