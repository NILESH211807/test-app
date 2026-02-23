import { Outlet } from "react-router-dom";

const AdminAuthLayout = () => {
    // const admin = false;

    // if (admin) {
    //     return <Navigate to="/admin" replace />;
    // }

    return <Outlet />;
};

export default AdminAuthLayout;