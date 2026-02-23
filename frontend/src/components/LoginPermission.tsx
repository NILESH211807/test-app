/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from './ui/scroll-area';
import { useAuthorizeUserQuery, useUserAccessMutation } from '@/redux/features/api/oauthSlice';
import { toast } from 'sonner';

const INITIAL_PERMISSIONS = [
    { id: "read_profile", label: "Read Profile", desc: "Access your name, avatar, and bio." },
    { id: "edit_profile", label: "Edit Profile", desc: "Change your display name and public info." },
    { id: "personal_details", label: "Personal Details", desc: "Access your verified email and phone." },
    { id: "activity_logs", label: "Activity Logs", desc: "View your recent login history." },
];

interface LoginPermissionProps {
    isLoginPermissionOpen: boolean;
    setIsLoginPermissionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPermission = ({ isLoginPermissionOpen, setIsLoginPermissionOpen }: LoginPermissionProps) => {
    // const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    // const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const [code, setCode] = useState<string | null>(null);

    // const { data, error, isLoading } = useFetchAuthorizeQuery({
    //     client_id: CLIENT_ID,
    //     redirect_uri: REDIRECT_URI
    // }, { skip: !isLoginPermissionOpen, refetchOnMountOrArgChange: true });

    // const requestedScopes = data?.requestedScopes || [];

    // const { data, error, isLoading } = useCheckPermissionQuery(undefined);
    // const requestedScopes = data?.requestedScopes || [];
    const { data, error, isLoading } = useAuthorizeUserQuery(undefined, { skip: !isLoginPermissionOpen, refetchOnMountOrArgChange: true });
    const requestedScopes = data?.scopes || [];

    const permissions = useMemo(() => INITIAL_PERMISSIONS.filter(perm => requestedScopes.includes(perm.id)), [requestedScopes]);

    const [selected, setSelected] = useState<string[]>([]);
    // const [approveAuthorization, { isLoading: isApproving }] = useApproveAuthorizationMutation();

    const [grantPermission, { isLoading: isApproving }] = useUserAccessMutation();

    const togglePermission = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (isLoading || error) return;
        setCode(data?.code || "");
    }, [data, error, isLoading]);

    // useEffect(() => {
    //     if (isLoading || error) return;
    //     if (data && data?.message === "Permission already granted.") {
    //         navigate('/', { replace: true });
    //     }
    // }, [data, error, isLoading, navigate]);

    const handleAuthorize = async () => {
        try {

            if (selected.length === 0) {
                toast.error("Please select at least one permission to proceed.");
                return;
            }

            const response = await grantPermission({
                code: code || "",
                scopes: selected,
            }).unwrap();

            const redirectUrl = response?.redirect_uri;
            if (redirectUrl) {
                window.location.replace(redirectUrl);
            }
        } catch (error: any) {
            // console.error("Authorization failed:", error?.data?.message || error);
            if (error?.data?.message === "Invalid or expired code") {
                toast.error("Your session has expired. Please log in again.");
                setIsLoginPermissionOpen(false);
                return;
            }
            const errorMessage = error?.data?.message || 'An unknown error occurred during authorization';
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <Dialog open={isLoginPermissionOpen} onOpenChange={setIsLoginPermissionOpen}>
                <DialogContent className="sm:max-w-115 p-0 overflow-hidden border-none shadow-2xl">
                    {
                        isLoading ? (
                            <div className='w-full  h-75 flex items-center justify-center'>
                                <div className='w-10 h-10 rounded-full border-2 border-primary border-l-transparent animate-spin'></div>
                            </div>
                        ) : error ? (
                            <div className='w-full  h-75 flex items-center justify-center'>
                                <p className='text-sm text-red-500'>{('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data && typeof (error.data as any).message === 'string' ? (error.data as any).message : "Failed to load authorization details. Please try again.")}</p>
                            </div>
                        ) : permissions?.length > 0 && (
                            <>
                                <div className="bg-primary/5 p-6 pb-4">
                                    <DialogHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center">
                                                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <DialogTitle className="text-lg font-bold">Permission Request</DialogTitle>
                                                <DialogDescription className="text-sm text-muted-foreground">
                                                    <strong>{data?.product || "An application"}</strong> is requesting access to your account.
                                                </DialogDescription>
                                            </div>
                                        </div>
                                    </DialogHeader>
                                </div>
                                <ScrollArea className="h-75 w-full">
                                    <div className="px-6 py-4 space-y-6">
                                        <p className="text-sm text-muted-foreground italic">
                                            Select the data you are comfortable sharing with this application:
                                        </p>

                                        {/* Permissions List */}
                                        <div className="grid gap-4">
                                            {permissions?.map((perm) => (
                                                <div
                                                    key={perm.id}
                                                    className={`flex items-start space-x-4 p-3 rounded-lg border transition-all duration-200 ${selected.includes(perm.id)
                                                        ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                                                        : "bg-background border-transparent hover:bg-muted/50"
                                                        }`}
                                                >
                                                    <Checkbox
                                                        id={perm.id}
                                                        checked={selected.includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                        className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                    />
                                                    <div className="grid gap-1 cursor-pointer" onClick={() => togglePermission(perm.id)}>
                                                        <label
                                                            htmlFor={perm.id}
                                                            className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                        >
                                                            {perm.label}
                                                        </label>
                                                        <p className="text-xs text-muted-foreground leading-snug">
                                                            {perm.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </ScrollArea>
                                <DialogFooter className="px-5 py-4 bg-muted/20 flex-row gap-3 sm:justify-end">
                                    <Button variant="outline" className="flex-1 sm:flex-none cursor-pointer" onClick={() => setIsLoginPermissionOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAuthorize}
                                        className="flex-1 sm:flex-none font-semibold gap-2 cursor-pointer"
                                        disabled={isApproving}
                                    >
                                        {isApproving ? "Authorizing..." : "Allow Access"}
                                    </Button>
                                </DialogFooter>
                            </>
                        )
                    }
                </DialogContent>
            </Dialog>
        </>

    );
};

export default LoginPermission;