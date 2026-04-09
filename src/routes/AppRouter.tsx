import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import TermsOfService from "../pages/TermsOfService";
import DataDeletion from "../pages/DataDeletion";
import PrivacyPolicy from "../pages/PrivacyPolicy";
// import Messages from "../pages/Messages";
// import Notifications from "../pages/Notifications";
import AuthRedirect from "../components/Auth/AuthRedirect";
import Profile from "../pages/Profile/Profile.tsx";
// import Settings from "../pages/Settings";

// PowerGym Pages
import Service from "../pages/Services/Service.tsx";
import StoryDetailPage from "../pages/Home/StoriesSection/StoryDetailPage.tsx";
import Pricing from "../pages/Pricing/Pricing.tsx";
import News from "../pages/News/News.tsx";
// import Promotions from "../pages/PowerGym/Promotions";
import Rewards from "../pages/Rewards/Rewards.tsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.tsx";
import Promotions from "../pages/Promotions/Promotions.tsx";
import PaymentResult from "../pages/Payment/PaymentResult.tsx";
import ForgotPassword from "../components/Auth/ForgotPassword.tsx";
import ResetPassword from "../components/Auth/ResetPassword.tsx";
import About from "../pages/About/About.tsx";

// Product and Order Pages
import { ProductCatalog } from "../pages/User/ProductCatalog";
import { ShoppingCart } from "../pages/User/Cart";
import { CheckoutPage, OrderConfirmation } from "../pages/User/Checkout";
import { OrderHistory, OrderDetail } from "../pages/User/Orders";

export const AppRouter = () => (
    <>
        <Routes>
            {/* Root - Redirect based on auth state */}
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/service" element={<Service />} />
            <Route path="/service/:id" element={<Service />} />
            <Route path={"/promotions"} element={<Promotions />} />
            <Route path={"/rewards"} element={<Rewards />} />
            <Route path="/stories/:storyId" element={<StoryDetailPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/news" element={<News />} />
            
            {/* Product Catalog - Public access */}
            <Route path="/products" element={<ProductCatalog />} />

            {/* Protected Routes - Require authentication */}
            <Route element={<ProtectedRoute />}>
                <Route path="/payment/result" element={<PaymentResult />} />
                <Route path="/powergym/rewards" element={<Rewards/>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                {/*<Route path="/settings" element={<Settings />} />*/}
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