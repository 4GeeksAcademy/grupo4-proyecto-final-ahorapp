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
import { Dashboard } from "./component/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";
import Wallet from "./component/Wallet.jsx";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Wallet />} path="/wallet/:id" />
                        <Route element={<Dashboard />} path="/dashboard" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                        {/* Login */}
                        <Route element={<Login/>} path="/login" />
                        {/* Siguientes rutas */}
                        <Route element={<Signup/>} path="/signup" />


                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
            <ToastContainer />
        </div>
    );
};

export default injectContext(Layout);
