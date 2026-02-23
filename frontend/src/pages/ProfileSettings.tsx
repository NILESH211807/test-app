/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUpdateProfileMutation, useUploadPictureMutation } from "@/redux/features/api/userSlice"
import { toast } from "sonner"
import { useQuery } from "@apollo/client/react"
import { GET_ME } from "@/graphql/query/user"
// import ChangePasswordSettings from "@/components/ChangePassword"

const profileSchema = z.object({
    name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 characters."),
    email: z.string().nonempty("Email is required").email("Please enter a valid email address."),
});

interface UserMe {
    id: string
    name: string,
    email: string,
    profile: string,
    isActive: string,
    role: string,
    isVerified: string,
    createdAt: string
}

interface UserMeResponse {
    me: UserMe
}

const ProfileSettings = () => {

    const { data } = useQuery<UserMeResponse>(GET_ME);

    const user = data?.me;
    const profileImageUrl = "https://github.com/shadcn.png"

    const [updateProfileMutation, { isLoading: isUpdateProfileLoading }] = useUpdateProfileMutation();

    const [uploadPictureMutation, { isLoading: isUploadPictureLoading }] = useUploadPictureMutation();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name,
            email: user?.email,
        },
    })

    async function onSubmit(values: z.infer<typeof profileSchema>) {

        const { name } = values;

        try {
            await updateProfileMutation({ name }).unwrap();
            toast.success("Profile updated successfully");
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    };


    // handleUploadPicture
    const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageType = ["image/png", "image/jpeg", "image/jpg"];

        if (!imageType.includes(file.type)) {
            toast.error("File type not allowed");
            return;
        }

        if (file.size > 1024 * 1024 * 5) {
            toast.error("File size is too large. Max 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        try {
            await uploadPictureMutation(formData).unwrap();
            toast.success("Profile uploaded successfully");
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-2 border-b pb-5">
                <h1 className="text-xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-sm -mt-1">Manage your digital identity and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-10">

                <aside className="flex flex-col items-center space-y-4 border-r pr-6 py-4">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-accent transition-all group-hover:opacity-80">
                            <div className="w-full h-full flex items-center justify-center">
                                {
                                    isUploadPictureLoading ? (
                                        <div className="w-10 h-10 border-2 animate-spin border-l-transparent rounded-full border-primary"></div>
                                    ) : (
                                        <img
                                            src={profileImageUrl}
                                            alt="Profile"
                                            className="object-cover w-full h-full"
                                        />
                                    )
                                }
                            </div>

                            <label
                                htmlFor="picture-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full"
                            >
                                <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change</span>
                            </label>
                        </div>

                        <input onChange={handleUploadPicture} id="picture-upload" type="file" className="hidden" accept="image/*" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-sm font-semibold">Upload your photo</h3>
                    </div>
                </aside>

                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm max-w-3xl">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your name and primary contact email.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> Name
                                    </Label>
                                    <Input {...form.register("name")} id="name" className="bg-background/50" />
                                    {form.formState.errors.name && (
                                        <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </Label>
                                    <Input disabled {...form.register("email")} id="email" className="bg-background/50" />
                                    {form.formState.errors.email && (
                                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                                {/* <Button variant="outline" type="button" className="gap-2 cursor-pointer">
                                    <Lock className="w-4 h-4" /> Change Password
                                </Button> */}

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Button type="submit" disabled={true} className="min-w-[120px] cursor-pointer">
                                        {isUpdateProfileLoading ? "Loading..." : "Update Profile"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    {/* <ChangePasswordSettings /> */}
                </Card>
            </div>

        </div>
    )
}

export default ProfileSettings;