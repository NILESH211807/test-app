/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { useSendOTPMutation } from "@/redux/features/api/authSlice";
// // import ForgotPasswordVerify from "@/components/ForgotPasswordVerify";


// Validation Schema
const formSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
});


const ForgotPassword = () => {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    });

    // const [sendOTPMutation, { isLoading: isSendOTPLoading }] = useSendOTPMutation();

    async function sendOTP(values: z.infer<typeof formSchema>) {
        console.log(values)
        // try {
        //     await sendOTPMutation({ ...values, type: "forgot-password" }).unwrap();
        //     toast.success("OTP sent to your email");
        //     setIsOtpSent(true);
        //     setEmail(values.email);
        // } catch (err: any) {
        //     const message = err?.data?.message || "Something went wrong";
        //     toast.error(message);
        // }
    }

    return (
        <div className="container mx-auto relative min-h-screen flex items-center justify-center">
            <div className="w-full p-4 lg:p-8 h-full flex items-center justify-center">
                <div className="flex w-full flex-col justify-center sm:w-[400px]">
                    <Card className="border-none shadow-none lg:shadow-sm lg:border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-semibold tracking-tight">Forgot Password</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(sendOTP)} className="space-y-4">
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


                                    <Button disabled={true} className="w-full mt-2 cursor-pointer" type="submit">
                                        Forgot Password
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword
