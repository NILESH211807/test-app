import Navbar from '@/components/Navbar';
import { Navigate, Outlet } from 'react-router-dom';
import { GET_ME } from '@/graphql/query/user';
import { useQuery } from '@apollo/client/react';

const ProtectedLayout = () => {

    const { loading, error, data } = useQuery<{ me: { role: string; isActive: boolean } }>(GET_ME);
    const role = data?.me?.role;

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 animate-spin border-indigo-600 border-l-transparent"></div>
            </div>
        );
    }

    if (error) {
        return <Navigate to="/login" replace />;
    }

    if (loading === false && role !== 'user') {
        return <Navigate to="/admin" replace />;
    }


    if (loading === false && data && data.me?.isActive === false) {
        return <Navigate to="/login" replace />;
    }

    return data ? (
        <>
            <Navbar />
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedLayout;
