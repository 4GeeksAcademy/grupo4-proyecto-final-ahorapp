import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import Login from "./pages/Login.jsx";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Dashboard from "./component/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";
import AddRecord from "./component/AddRecord.jsx";
import SavingsGoals from "./component/SavingsGoals.jsx";
import Unauthorized from "./pages/Unauthorized.jsx"
import ListUsers from "./component/ListUsers.jsx";
import AdminLayout from "./component/AdminLayout.jsx";
import ListCategories from "./component/ListCategories.jsx";
import HandleUpdateUser from "./component/HandleUpdateUser.jsx"; 
import PayPalSuccess from "./pages/PayPalSuccess.jsx";
import PayPalCancel from "./pages/PayPalCancel.jsx";
import WalletDetail from "./pages/WalletDetail.jsx";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<SavingsGoals />} path="/savingsgoals" />

                        <Route element={<Dashboard />} path="/dashboard" />
                        <Route element={<Single />} path="/single/:theid" />
                        {/* Admin routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="users" index element={<ListUsers />} />
                            <Route path="categories" index element={<ListCategories />} />
                        </Route>

                        {/* Paypal */}
                        <Route path="/paypal/success" element={<PayPalSuccess />} />
                        <Route path="/paypal/cancel" element={<PayPalCancel />} />

                        {/* Login */}
                        <Route element={<Login />} path="/login" />
                        {/* Siguientes rutas */}

                        {/* Editar Usuario */}
                        <Route path="/edit-user" element={<HandleUpdateUser />} /> 

                        <Route element={<Signup />} path="/signup" />
                        <Route element={<AddRecord />} path="/records/add" />

                        {/* Wallets */}
                        <Route element={<WalletDetail />} path="wallet/:wallet_id" />

                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route element={<h1>Not found!</h1>} />



                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
            <ToastContainer />
        </div>
    );
};

export default injectContext(Layout);
