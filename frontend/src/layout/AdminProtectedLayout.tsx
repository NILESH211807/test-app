import { Navbar } from "@/components/(admin)/Navbar";
import { AppSidebar } from "@/components/(admin)/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GET_ME } from "@/graphql/query/user";
import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet } from "react-router-dom";

interface GetMe {
    id: string
    name: string
    email: string
    profile: string
    isActive: boolean
    role: string
    isVerified: boolean
    createdAt: string
}

export interface GetMeResponse {
    me: GetMe
}

const AdminProtectedLayout = () => {

    const { loading, error, data } = useQuery<GetMeResponse>(GET_ME);
    const role = data?.me?.role || null;

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 animate-spin border-indigo-600 border-l-transparent"></div>
            </div>
        );
    }

    if (error) {
        return <Navigate to="/admin/login" replace />;
    }

    if (loading === false && role !== 'admin' && role !== 'super-admin') {
        return <Navigate to="/" replace />;
    }

    if (loading === false && data?.me?.isActive === false) {
        return <Navigate to="/admin/login" replace />;
    }

    return data ? (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                    <Navbar />
                    <main className="p-6 max-sm:p-3 overflow-hidden">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </>
    ) : (
        <Navigate to="/admin/login" replace />
    );
};

export default AdminProtectedLayout;
