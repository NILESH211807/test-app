import { LayoutDashboard, Users, ShieldCheck, LogOut, UserCog, FileChartColumnIncreasing, KeySquare } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { LOGOUT_MUTATION } from "@/graphql/mutations/auth";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Navigation Data
const items = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users-management", icon: Users },
    { title: "Admins", url: "/admin/admin-management", icon: ShieldCheck },
    { title: "Permissions", url: "/admin/permission", icon: UserCog },
    { title: "Excel File View", url: "/admin/excel", icon: FileChartColumnIncreasing },
    { title: "Product", url: "/admin/product", icon: KeySquare },
];


export function AppSidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [logout, { loading }] = useMutation(LOGOUT_MUTATION, {
        onCompleted: async () => {
            toast.success('Logout successfully');
            navigate('/admin/login', { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const handleLogout = () => logout({})

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>App</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                                        <Link className={`py-6 text-lg font-semibold px-3 ${location.pathname === item.url ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`} to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} className="text-destructive cursor-pointer hover:text-destructive">
                            <LogOut />
                            <span>{loading ? 'Loading...' : 'Logout'}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}