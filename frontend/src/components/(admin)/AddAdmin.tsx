"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_NEW_ADMIN } from "@/graphql/mutations/admin";
import { toast } from "sonner";
import { GET_ADMINS } from "@/graphql/query/admin";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GET_ME } from "@/graphql/query/user";

const userSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email address").toLowerCase(),
    isVerified: z.boolean().default(false),
    isActive: z.boolean().default(true),
    role: z.enum(["admin", "super-admin"], {
        message: "Please select a role.",
    }),
});

type UserFormValues = z.input<typeof userSchema>;

interface Props {
    isAddAdminModalOpen: boolean,
    setIsAddAdminModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GetMe {
    id: string
    name: string
    email: string
    profile: string
    isActive: string
    role: string
    isVerified: string
    createdAt: string
    permission: {
        activeAdmin: boolean,
        activeUser: boolean,
        deleteAdmin: boolean,
        deleteUser: boolean
    }
}

interface GetMeResponse {
    me: GetMe
}

export function AddNewAdmin({ isAddAdminModalOpen, setIsAddAdminModalOpen }: Props) {

    const { data } = useQuery<GetMeResponse>(GET_ME);
    const me = data?.me;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            isVerified: false,
            isActive: true,
            role: "admin",
        },
    });

    const [addAdmin, { loading }] = useMutation(ADD_NEW_ADMIN, {
        onCompleted: () => {
            toast.success('admin created successfully.');
            setIsAddAdminModalOpen(false);
            form.reset();
        },
        onError: (err) => {
            const message = err.message || "Something went wrong";
            toast.error(message);
        },
        refetchQueries: [{ query: GET_ADMINS }]
    })

    function onSubmit(data: UserFormValues) {
        addAdmin({
            variables: data
        });
    }

    return (
        <Dialog open={isAddAdminModalOpen} onOpenChange={setIsAddAdminModalOpen}>
            <DialogContent className="sm:max-w-135 rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add New Admin</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new admin account.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4">
                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role" // Changed from email to role for clarity
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Roles</SelectLabel>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem disabled={me?.role === 'admin'} value="super-admin">Super Admin</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            {/* Password Field with Toggle */}
                            {/* <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    className="pr-10"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        </div>

                        {/* Status Toggles - Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="isVerified"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-y-0">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm">Verified</FormLabel>
                                            <FormDescription className="text-[10px]">Identity confirmed</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-y-0">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm">Active</FormLabel>
                                            <FormDescription className="text-[10px]">Enable login</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="cursor-pointer"
                                onClick={() => setIsAddAdminModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button disabled={loading} type="submit"
                                className="cursor-pointer"
                            >
                                {loading ? 'Loading...' : 'Add new admin'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}