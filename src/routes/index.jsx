import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Users from "../Pages/Dashboard/Users";
import Admin from "../Pages/Dashboard/Admin";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import User from "../Pages/Dashboard/User";
import UserProfile from "../Pages/Dashboard/AdminProfile/UserProfile";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition";
import PrivateRoute from "./PrivateRoute";
import Faq from "../components/ui/Settings/Faq";
import AboutUs from "../components/ui/Settings/AboutUs";
import Orders from "../Pages/Dashboard/Orders";
import Cancellation from "../Pages/Dashboard/Cancellation";
import EmployeeProfile from "../Pages/Dashboard/EmployeeProfile";
import ProductList from "../Pages/Dashboard/Product/ProductList";
import AddCategory from "../Pages/Dashboard/category/AddCategory";
import AddSubCategory from "../Pages/Dashboard/category/AddSubCategory";
import Overview from "../Pages/CompanyDashboard/Overview";
import AddOrEditProduct from "../Pages/Dashboard/Product/AddOrEditProduct";
import CompanyOrderPage from "../Pages/Dashboard/CompanyOrderPage";
import ManageSingleCompanyPrices from "../Pages/Dashboard/ManageSingleCompanyPrices";
import CompanyProduct from "../Pages/Dashboard/CompanyProduct";
import CreateOrderMain from "../Pages/CreateOrderPage/CreateOrderMain";
import EmployeesByCompany from "../Pages/CreateOrderPage/EmployeesByCompany";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/users",
        element: <Users />,
      },

      {
        path: "/company/details/:id",
        element: <User />,
      },
      {
        path: "/employee/details/:id",
        element: <EmployeeProfile />,
      },
      {
        path: "/company/manage-prices/:id",
        element: <ManageSingleCompanyPrices />,
      },
      {
        path: "/addSubCategory",
        element: <AddSubCategory />,
      },
      {
        path: "/addCategory",
        element: <AddCategory />,
      },

      {
        path: "/addAdmin",
        element: <Admin />,
      },

      {
        path: "/overview",
        element: <Overview />,
      },
      {
        path: "/company-products",
        element: <CompanyProduct />,
      },

      {
        path: "/addProduct",
        element: <AddOrEditProduct />,
      },
      {
        path: "/product/:id",
        element: <AddOrEditProduct />,
      },
      {
        path: "/productList",
        element: <ProductList />,
      },

      {
        path: "/personal-information",
        element: <UserProfile />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/cancellation",
        element: <Cancellation />,
      },
      {
        path: "f-a-q",
        element: <Faq />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },

      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "create-order",
        element: <CreateOrderMain />,
      },
      {
        path: "/employees/:id",
        element: <EmployeesByCompany />,
      },
      {
        path: "/company-orders",
        element: <CompanyOrderPage />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },

      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-condition",
        element: <TermsAndCondition />,
      },

      {
        path: "/change-password",
        element: <ChangePassword />,
      },

      {
        path: "/profile",
        element: <AdminProfile />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
