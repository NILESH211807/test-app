/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CircleUserRound, LogOut, UserRound, UserRoundCog } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useMutation, useQuery } from "@apollo/client/react"
import { GET_ME } from "@/graphql/query/user"
import type { GetMeResponse } from "@/layout/AdminProtectedLayout"
import { LOGOUT_MUTATION } from "@/graphql/mutations/auth"


export function Navbar() {
    const navigate = useNavigate();

    const { data, loading } = useQuery<GetMeResponse>(GET_ME);
    const me = data?.me;


    const [logout, { loading: logoutLoading }] = useMutation(LOGOUT_MUTATION, {
        onCompleted: async () => {
            toast.success('Logout successfully');
            navigate('/admin/login', { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const handleLogout = async () => logout({})

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/admin">App</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Right side of navbar */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative flex items-center justify-center rounded-full p-0.5 transition-all duration-200 hover:ring-4 hover:ring-primary/10 active:scale-95 outline-none group">
                            <div className="bg-linear-to-tr from-muted to-background p-1.5 rounded-full border shadow-sm group-hover:border-primary/50 transition-colors cursor-pointer">
                                <CircleUserRound size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={12}
                        className="w-64 p-2 rounded-xl shadow-xl border-muted/60 animate-in fade-in zoom-in-95 duration-200"
                    >
                        {/* User Info Header Section */}
                        <div className="flex py-2 px-2 gap-3 capitalize items-center rounded-lg">
                            <CircleUserRound size={30} />
                            <div>
                                <DropdownMenuLabel className="p-0 font-bold text-sm tracking-tight text-foreground">
                                    {loading ? (
                                        <div className="h-4 w-24 animate-pulse bg-muted-foreground/20 rounded" />
                                    ) : (
                                        me?.name || 'Administrator'
                                    )}
                                </DropdownMenuLabel>
                                <p className="text-[11px] font-medium tracking-wider text-muted-foreground/70 truncate">
                                    {me?.email || 'System Account'}
                                </p>
                            </div>
                        </div>

                        <DropdownMenuSeparator className="my-1 opacity-50" />

                        {/* Action Group */}
                        <div className="space-y-0.5">
                            <DropdownMenuItem
                                onSelect={() => navigate('/admin/profile')}
                                className="rounded-md cursor-pointer py-2 focus:bg-primary/5 focus:text-primary transition-colors"
                            >
                                <UserRound />
                                <span className="flex-1">Profile Settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onSelect={() => navigate('/admin/admin-permissions')}
                                className="rounded-md cursor-pointer py-2 focus:bg-primary/5 focus:text-primary transition-colors"
                            >
                                <UserRoundCog />
                                Permissions
                            </DropdownMenuItem>
                        </div>

                        <DropdownMenuSeparator className="my-1 opacity-50" />

                        {/* Logout with destructive feedback */}
                        <DropdownMenuItem
                            onSelect={handleLogout}
                            disabled={logoutLoading}
                            className="rounded-md cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors font-medium"
                        >
                            <LogOut className="text-destructive" />
                            {logoutLoading ? 'Please wait...' : 'Sign out'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}