/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCog, Trash2, ShieldAlert } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ADMIN_PERMISSIONS, UPDATE_ADMIN_PERMISSIONS } from "@/graphql/query/admin";
import { toast } from "sonner";

interface AdminPermissionsModalProps {
    isPermissionModalOpen: boolean;
    setIsPermissionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    adminId: string
}

interface PermissionForm {
    activeAdmin: boolean,
    activeUser: boolean
    deleteAdmin: boolean
    deleteUser: boolean
}

interface GetAdminPermissions {
    getAdminPermissions: PermissionForm
}

export function AdminPermissionsModal({
    isPermissionModalOpen,
    setIsPermissionModalOpen,
    adminId
}: AdminPermissionsModalProps) {

    const { loading, data, error } = useQuery<GetAdminPermissions>(
        GET_ADMIN_PERMISSIONS,
        {
            variables: { userId: adminId },
            skip: !isPermissionModalOpen,
        }
    );

    const [updateAdminPermission, { loading: updating }] = useMutation(UPDATE_ADMIN_PERMISSIONS, {
        onCompleted: () => {
            toast.success("Permission updated successfully");
            setIsPermissionModalOpen(false);
        },
        onError: (error) => {
            const message = error.message || "Something went wrong";
            toast.error(message);
        },
        refetchQueries: adminId
            ? [
                {
                    query: GET_ADMIN_PERMISSIONS,
                    variables: { userId: adminId },
                },
            ]
            : [],

    })

    const adminPermissions = useMemo(() =>
        data?.getAdminPermissions ?? {} as PermissionForm, [data?.getAdminPermissions]);


    const { control, handleSubmit, reset } = useForm<PermissionForm>({
        defaultValues: {
            "activeAdmin": false,
            "activeUser": false,
            "deleteAdmin": false,
            "deleteUser": false,
        }
    });

    useEffect(() => {
        if (loading || error) return;
        if (adminPermissions) {

            reset({
                activeAdmin: adminPermissions.activeAdmin,
                activeUser: adminPermissions.activeUser,
                deleteAdmin: adminPermissions.deleteAdmin,
                deleteUser: adminPermissions.deleteUser,
            });
        }
    }, [adminPermissions, reset, loading, error]);


    const handlePermissionUpdate = (data: PermissionForm) => updateAdminPermission({
        variables: {
            userId: adminId,
            ...data
        }
    })

    return (
        <Dialog open={isPermissionModalOpen} onOpenChange={setIsPermissionModalOpen}>
            <DialogContent className="sm:max-w-137.5` gap-0 p-0 overflow-hidden rounded-xl">
                <form
                    onSubmit={handleSubmit(handlePermissionUpdate)}
                    className="flex flex-col flex-1 overflow-hidden"
                >

                    <div className="p-6 pb-4">
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <UserCog className="h-5 w-5 text-primary" />
                                </div>
                                <DialogTitle className="text-xl">Admin Permissions</DialogTitle>
                            </div>
                            <DialogDescription>
                                Define what this role can access and manage within the system.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <Separator />
                    {
                        loading ? (
                            <div className="w-full h-[30vh] flex items-center justify-center">
                                <div className="border-3 w-12 h-12 border-l-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="w-full h-[30vh] flex items-center justify-center">
                                <p className="text-red-500">{error.message || "Error fetching permissions"}</p>
                            </div>
                        ) : (
                            <ScrollArea className="max-h-[60vh] px-6">
                                <div className="space-y-8 py-6">

                                    {/* User Management */}
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                User Management
                                            </h4>
                                            <Badge variant="secondary">Standard</Badge>
                                        </div>

                                        <div className="grid gap-4">
                                            <PermissionItem
                                                id="activeUser"
                                                title="Activate/Deactivate Users"
                                                description="Toggle user access to the platform."
                                                control={control}
                                            />

                                            <PermissionItem
                                                id="deleteUser"
                                                title="Delete User Accounts"
                                                description="Permanently remove user data from the system."
                                                warning
                                                control={control}
                                            />
                                        </div>
                                    </section>

                                    {/* System Administration */}
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                System Administration
                                            </h4>
                                            <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                                                Elevated
                                            </Badge>
                                        </div>

                                        <div className="grid gap-4">
                                            <PermissionItem
                                                id="activeAdmin"
                                                title="Manage Admin Status"
                                                description="Promote users to admin or revoke admin privileges."
                                                control={control}
                                            />

                                            <PermissionItem
                                                id="deleteAdmin"
                                                title="Delete Admin Accounts"
                                                description="High-risk action. Remove other administrators."
                                                warning
                                                control={control}
                                            />
                                        </div>
                                    </section>

                                </div>
                            </ScrollArea>
                        )
                    }
                    <Separator />

                    <DialogFooter className="p-6 bg-muted/30 relative z-50">
                        <Button
                            type="button"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => setIsPermissionModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading} className="px-8 shadow-md cursor-pointer">
                            {updating ? 'Loading...' : 'Update Permissions'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// Helper Component
function PermissionItem({
    id,
    title,
    description,
    warning = false,
    control,
}: {
    id: keyof PermissionForm;
    title: string;
    description: string;
    warning?: boolean;
    control: any;
}) {
    return (
        <div className="flex items-start justify-between space-x-4 rounded-xl border p-4 transition-colors hover:bg-muted/50">
            <div className="flex gap-3">
                {warning ? (
                    <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                ) : (
                    <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
                )}
                <div className="space-y-1">
                    <Label htmlFor={id} className="text-sm font-medium leading-none flex items-center gap-2">
                        {title}
                        {warning && <ShieldAlert className="h-3 w-3 text-orange-500" />}
                    </Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <Controller
                name={id}
                control={control}
                render={({ field }) => (
                    <Switch
                        id={id}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
        </div>
    );
}
