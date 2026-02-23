import { Navbar } from '@/components/(admin)/Navbar';
import { AppSidebar } from '@/components/(admin)/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { GET_ME } from '@/graphql/query/user';
import { useQuery } from '@apollo/client/react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminLayout = () => {

    const { loading, error, data } = useQuery(GET_ME);

    console.log(data)

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

    return data ? (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1">
                    <Navbar />
                    <main className="p-6">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </>
    ) : (
        <Navigate to="/admin/login" replace />
    );

};

export default AdminLayout;
