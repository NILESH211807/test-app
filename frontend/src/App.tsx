
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import ProtectedLayout from './layout/ProtectedLayout';
import Loader from './components/Loader';
import AdminAuthLayout from './layout/AdminAuthLayout';
import AdminProtectedLayout from './layout/AdminProtectedLayout';
import AdminDashboard from './pages/(admin)/AdminDashboard';
import SetNewPassword from './pages/(admin)/(auth)/SetNewPassword';
import Permission from './pages/(admin)/Permission';
import ExcelView from './components/(admin)/Excel-View';
import ExcelFileEditor from './pages/(admin)/ExcelFileEditor';
import Product from './pages/(admin)/Product';
// import ErrorPage from './pages/ErrorPage';

const Signup = lazy(() => import('./pages/(auth)/Signup'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/(auth)/Login'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const ForgotPassword = lazy(() => import('./pages/(auth)/ForgotPassword'));

const AdminSignup = lazy(() => import('./pages/(admin)/(auth)/Signup'));
const AdminLogin = lazy(() => import('./pages/(admin)/(auth)/Login'));

const Admin = lazy(() => import('./pages/(admin)/Admin'));
const Users = lazy(() => import('./pages/(admin)/Users'));

const App = () => {


    return (
        <Suspense fallback={<Loader />}>
            <Routes>

                <Route path="/" element={<ProtectedLayout />}>
                    <Route index element={<Home />} />
                    <Route path="profile" element={<ProfileSettings />} />
                </Route>

                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                {/* <Route path="error" element={<ErrorPage />} /> */}


                <Route path="/admin" element={<AdminAuthLayout />}>
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="signup" element={<AdminSignup />} />
                    <Route path="set-password" element={<SetNewPassword />} />
                </Route>


                <Route path="/admin" element={<AdminProtectedLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="admin-management" element={<Admin />} />
                    <Route path="users-management" element={<Users />} />
                    <Route path="permission" element={<Permission />} />
                    <Route path="excel" element={<ExcelView />} />
                    <Route path="excel-editor/:fid" element={<ExcelFileEditor />} />
                    <Route path="product" element={<Product />} />
                </Route>
            </Routes>
        </Suspense>


    )
}

export default App
