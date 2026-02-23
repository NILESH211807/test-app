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
import { SIGNUP_USER_MUTATION } from "@/graphql/mutations/auth";

// Validation Schema
const formSchema = z.object({
    name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});


export default function SignupPage() {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const [mutate, { loading }] = useMutation(SIGNUP_USER_MUTATION, {
        onCompleted: () => {
            toast.success("Account created successfully");
            navigate('/', { replace: true });
        },
        onError: (err: any) => {
            const message = err?.message || "Something went wrong";
            toast.error(message);
        },
    });


    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            variables: values,
        });
    }

    return (
        <div className="container mx-auto relative min-h-screen flex items-center justify-center">
            <div className="w-full p-4 lg:p-8 h-full flex items-center justify-center">
                <div className="flex w-full flex-col justify-center sm:w-[400px]">
                    <Card className="border-none shadow-none lg:shadow-sm lg:border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
                            <CardDescription>Enter your details below to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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

                                    <Button disabled={loading} className="w-full mt-2 cursor-pointer" type="submit">
                                        {loading ? "Please wait..." : "Submit"}
                                    </Button>
                                </form>
                            </Form>
                            <div>
                                <p className='text-center text-sm mt-3'>Already have an account? <Link to="/login" className='text-indigo-600 font-semibold'>Login</Link></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* {isOtpSent && <OTPInput isOtpSent={isOtpSent} setIsOtpSent={setIsOtpSent} formData={formData} />} */}
        </div>
    );
}