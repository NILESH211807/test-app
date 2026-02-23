import {
    MoreHorizontal,
    UserMinus,
    UserCheck,
    Mail,
    Shield,
    Trash2
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
import { GET_USERS } from "@/graphql/query/admin"
import { formatDate } from "@/utils/formatDate"
import { CHANGE_ACCOUNT_STATUS, DELETE_USER } from "@/graphql/mutations/admin"
import { toast } from "sonner";
import type { Admin } from "./AdminTable";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useCallback, useMemo, useState } from "react"
import { SearchInput } from "../Search"
import { debounce } from "@/utils/debounce"

interface GetUsersResponse {
    getUsers: {
        success: boolean;
        message: string;
        data: Admin[];
        length: number;
    }
}

export function UserTable() {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { loading, data, error } = useQuery<GetUsersResponse>(GET_USERS, {
        variables: {
            page: currentPage,
            limit: 10,
            query: searchQuery
        }
    });
    const users = data?.getUsers?.data || [];
    const length = data?.getUsers?.length || 0;
    const isLastPage = length < 10;

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

    // delete user
    const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER, {
        onCompleted: () => {
            toast.success('User deleted successfully')
        },
        onError: (error) => {
            const message = error.message || "Something went wrong";
            toast.error(message)
        },
        refetchQueries: [{ query: GET_USERS }]
    });


    // handleDeleteClick
    const handleDeleteClick = (id: string) => {
        deleteUser({
            variables: {
                userId: id
            }
        })
    }

    // handleNextPage
    const handleNextPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!isLastPage) {
            setCurrentPage(prev => prev + 1);
        }
    }

    const handlePrevPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }

    const debouncedSearch = useMemo(() => debounce((value: string) => setSearchQuery(value), 500), []);

    // handleSearchInput
    const handleSearchInput = useCallback((value: string) => {
        debouncedSearch(value);
    }, [debouncedSearch]);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <SearchInput onChange={handleSearchInput} placeholder='Search Users (email)' />
                {/* export excel file */}
                <Button variant="outline" className="cursor-pointer">Export Excel</Button>
            </div>

            {
                loading ? (
                    <div className="w-full mt-10 text-center">
                        <h1 className="font-semibold tracking-wide">Loading...</h1>
                    </div>

                ) : error ? (
                    <div className="w-full mt-10 text-center">
                        <h1 className="font-semibold tracking-wide text-red-500">Error: {error.message}</h1>
                    </div>
                ) : (
                    <div className="space-y-4">
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
                                    {users?.map((user: Admin) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground md:hidden">{user.email}</span>
                                                    <span className="hidden md:inline text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Shield className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{user.role}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200" : ""}>
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {user.isVerified ? (
                                                    <Badge variant="outline" className="text-blue-600 border-blue-200">Verified</Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Pending</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                {formatDate(user.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                            <Mail className="mr-2 h-4 w-4" /> Copy Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleAccountChange(user.id)} className={user.isActive ? "text-destructive focus:text-destructive" : "text-emerald-600 focus:text-emerald-600"}>
                                                            {user.isActive ? (
                                                                <>
                                                                    {changeIsLoading ? 'Loading...' : <><UserMinus className="mr-2 h-4 w-4" /> Deactivate</>}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {changeIsLoading ? 'Loading...' : <><UserCheck className="mr-2 h-4 w-4" /> Activate</>}
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(user.id)} className="text-destructive focus:text-destructive">
                                                            {deleting ? 'Loading...' : <> <Trash2 className="mr-2 h-4 w-4" /> Delete</>}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* --- PAGINATION SECTION --- */}
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={handlePrevPage}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationLink href="#" isActive>
                                            {currentPage}
                                        </PaginationLink>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={handleNextPage}
                                            className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )
            }

        </>
    )
}