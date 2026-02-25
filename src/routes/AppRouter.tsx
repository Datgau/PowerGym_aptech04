import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import Home from "../pages/Home";
import TermsOfService from "../pages/TermsOfService";
import DataDeletion from "../pages/DataDeletion";
import PrivacyPolicy from "../pages/PrivacyPolicy";
// import Messages from "../pages/Messages";
// import Notifications from "../pages/Notifications";
import AuthRedirect from "../components/Auth/AuthRedirect";
// import Profile from "../pages/Profile";
// import Settings from "../pages/Settings";
// import {ChatProvider} from "../contexts/ChatContext.tsx";

// PowerGym Pages
import Club from "../pages/Club/Club.tsx";
import Services from "../pages/PowerGym/Services";
import Pricing from "../pages/PowerGym/Pricing";
import News from "../pages/News/News.tsx";
// import Promotions from "../pages/PowerGym/Promotions";
import Rewards from "../pages/PowerGym/Rewards";
import AdminHome from "../pages/Admin/AdminHome.tsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.tsx";

export const AppRouter = () => (
    <>
        <Routes>
            {/* Root - Redirect based on auth state */}
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="/home" element={<Home />} />
            <Route path="/club" element={<Club />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/news" element={<News />} />
            
            {/* Protected Routes - Require authentication */}
            <Route element={<ProtectedRoute />}>
                {/*<Route path="/powergym/news" element={<News />} />*/}
                {/*<Route path="/powergym/promotions" element={<Promotions />} />*/}
                <Route path="/powergym/rewards" element={<Rewards/>} />
                {/*<Route path="/messages" element={<Messages />} />*/}
                {/*<Route path="/messages/:conversationId" element={<Messages />} />*/}
                {/*<Route path="/notifications" element={<Notifications />} />*/}
                {/*<Route path="/profile" element={<Profile />} />*/}
                {/*<Route path="/settings" element={<Settings />} />*/}
            </Route>
            {/* Public Routes */}
            {/*<Route element={<MainLayout />}>*/}
            {/*    <Route path="/" element={<Home />} />*/}
            {/*    <Route path="/home" element={<Home />} />*/}
            {/*    <Route path="/shop" element={<Shop />} />*/}
            {/*    <Route path="/about" element={<About />} />*/}
            {/*    <Route path="/contact" element={<Contact />} />*/}
            {/*    <Route path="/blog" element={<Blog />} />*/}
            {/*    <Route path="/blog/:id" element={<BlogDetail />} />*/}
            {/*    <Route path="/detail-product/:id" element={<ProductDetail />} />*/}
            {/*    <Route path="/cart" element={<Cart />} />*/}
            {/*    <Route path="/wishlist" element={<WishlistPage />} />*/}
            {/*    <Route path="/faqs" element={<FAQPage />} />*/}
            {/*    <Route path="/myorders" element={<MyOrders />} />*/}
            {/*    <Route path="/checkout" element={<Checkout />} />*/}
            {/*</Route>*/}

            {/* Protected Routes - cần đăng nhập */}
            <Route element={<ProtectedRoute />}>
                {/*<Route element={<MainLayout />}>*/}

                {/*    <Route path="/profile" element={<Profile />} />*/}
                {/*    <Route path="/profile/edit" element={<EditProfile />} />*/}
                {/*</Route>*/}
            </Route>

            {/* Admin Routes - Only for ADMIN role */}
            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                        showLoginDialog
                    />
                }
            >
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
</>
);