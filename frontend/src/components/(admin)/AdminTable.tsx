import {
    MoreHorizontal,
    UserMinus,
    UserCheck,
    Mail,
    Shield,
    Logs
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQuery } from "@apollo/client/react"
import { GET_ADMINS } from "@/graphql/query/admin"
import { formatDate } from "@/utils/formatDate"
import { CHANGE_ACCOUNT_STATUS } from "@/graphql/mutations/admin";
import { toast } from "sonner"
import { useCallback, useMemo, useState } from "react"
import { AdminPermissionsModal } from "./AdminPermission"
import { SearchInput } from "../Search"
import { debounce } from "@/utils/debounce"

export interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
}


export interface GetAdminsResponse {
    getAdmin: Admin[];
}


export function AdminTable() {

    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { loading, data } = useQuery<GetAdminsResponse>(GET_ADMINS, {
        variables: {
            query: searchQuery
        }
    });

    const admins = data?.getAdmin || [];
    const [adminId, setAdminId] = useState<string>("");

    const [changeAccountStatus, { loading: changeIsLoading }] = useMutation(CHANGE_ACCOUNT_STATUS, {
        onCompleted: () => {
            toast.success('Updated successfully')
        },
        onError: (error) => {
            const message = error.message || "Something went wrong";
            toast.error(message)
        }
    });

    const handleAccountChange = (id: string) => {
        changeAccountStatus({
            variables: {
                userId: id
            }
        })
    }

    // handlePermissions
    const handlePermissions = (id: string) => {
        setIsPermissionModalOpen(true);
        setAdminId(id);
    }

    const debouncedSearch = useMemo(() => debounce((value: string) => setSearchQuery(value), 500), []);

    // handleSearchInput
    const handleSearchInput = useCallback((value: string) => {
        debouncedSearch(value);
    }, [debouncedSearch]);

    return (
        <>
            <SearchInput onChange={handleSearchInput} placeholder='Search admin (email)' />

            {
                loading ? (
                    <div className="w-full mt-10 text-center">
                        <h1 className="font-semibold tracking-wide">Loading...</h1>
                    </div>

                ) : (
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden sm:table-cell">Verified</TableHead>
                                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins?.map((admin: Admin) => (
                                    <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{admin.name}</span>
                                                <span className="text-xs text-muted-foreground md:hidden">{admin.email}</span>
                                                <span className="hidden md:inline text-xs text-muted-foreground">{admin.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Shield className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">{admin.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={admin.isActive ? "default" : "secondary"} className={admin.isActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200" : ""}>
                                                {admin.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {admin.isVerified ? (
                                                <Badge variant="outline" className="text-blue-600 border-blue-200">Verified</Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Pending</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                            {formatDate(admin.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(admin.email)}>
                                                        <Mail className="mr-2 h-4 w-4" /> Copy Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleAccountChange(admin.id)} className={admin.isActive ? "text-destructive focus:text-destructive" : "text-emerald-600 focus:text-emerald-600"}>
                                                        {admin.isActive ? (
                                                            <>
                                                                {
                                                                    changeIsLoading ? (
                                                                        'Loading...'
                                                                    ) : (
                                                                        <>
                                                                            <UserMinus className="mr-2 h-4 w-4" /> Deactivate
                                                                        </>
                                                                    )
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                {
                                                                    changeIsLoading ? (
                                                                        'Loading...'
                                                                    ) : (
                                                                        <>
                                                                            <UserCheck className="mr-2 h-4 w-4" /> Activate
                                                                        </>
                                                                    )
                                                                }
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handlePermissions(admin.id)} className="cursor-pointer">
                                                        <Logs className="mr-2 h-4 w-4" /> Permissions
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )
            }


            {/* <Activity mode={isPermissionModalOpen ? 'visible' : 'hidden'}> */}
            {
                isPermissionModalOpen && (
                    <AdminPermissionsModal
                        isPermissionModalOpen={isPermissionModalOpen}
                        setIsPermissionModalOpen={setIsPermissionModalOpen}
                        adminId={adminId}
                    />)
            }
            {/* </Activity> */}

        </>
    )
}