/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShieldCheck, ShieldAlert, User, Trash2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '@/graphql/query/user';

interface Permission {
    activeAdmin: boolean;
    activeUser: boolean;
    deleteAdmin: boolean;
    deleteUser: boolean;
}

interface PermissionsResponse {
    me: {
        permission: Permission;
    }
}

const Permission = () => {

    const { data } = useQuery<PermissionsResponse>(GET_ME);
    const permission = data?.me?.permission;

    const permissions = {
        activeAdmin: permission?.activeAdmin || false,
        activeUser: permission?.activeUser || false,
        deleteAdmin: permission?.deleteAdmin || false,
        deleteUser: permission?.deleteUser || false,
    };

    const PermissionRow = ({ icon: Icon, label, value, description }: any) => (
        <div className="flex items-center justify-between space-x-4 py-4">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-secondary rounded-full">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                    <Label className="text-base font-medium">{label}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Badge variant={value ? "default" : "secondary"} className="capitalize">
                    {value ? "Enabled" : "Disabled"}
                </Badge>
                <Switch checked={value} disabled aria-readonly />
            </div>
        </div>
    );

    return (
        <div className="w-full mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Account Permissions</h1>
                <p className="text-muted-foreground -mt-2">
                    View your current access levels and administrative privileges. These settings are read-only.
                </p>
            </div>

            <div className="grid gap-6 min-[1080px]:grid-cols-2">
                {/* Admin Permissions Group */}
                <Card className="border-t-4 border-t-primary">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Administrative Access</CardTitle>
                        </div>
                        <CardDescription>System-level management controls</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-0">
                        <PermissionRow
                            icon={ShieldCheck}
                            label="Active Admin"
                            description="Full access to admin panel"
                            value={permissions.activeAdmin}
                        />
                        <Separator />
                        <PermissionRow
                            icon={Trash2}
                            label="Delete Admin"
                            description="Ability to remove other admins"
                            value={permissions.deleteAdmin}
                        />
                    </CardContent>
                </Card>

                {/* User Permissions Group */}
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            <CardTitle>User Management</CardTitle>
                        </div>
                        <CardDescription>Permissions for standard user accounts</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-0">
                        <PermissionRow
                            icon={ShieldCheck}
                            label="Active User"
                            description="Standard platform access"
                            value={permissions.activeUser}
                        />
                        <Separator />
                        <PermissionRow
                            icon={Trash2}
                            label="Delete User"
                            description="Ability to remove user accounts"
                            value={permissions.deleteUser}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                    If you require additional permissions, please contact your system super-administrator.
                </p>
            </div>
        </div>
    );
};

export default Permission;