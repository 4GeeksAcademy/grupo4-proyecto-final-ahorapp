import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";
import HeaderCardAdmin from "./HeaderCardAdmin.jsx";
import HeaderInfoCard from "./HeaderInfoCard.jsx";
import CalculadoraAhorro from "./CalculadoraAhorro.jsx";
import RadialProgressChart from "./RadialProgressChart.jsx";
import HandleUpdateUser from "./HandleUpdateUser.jsx";
import "../../styles/index.css";

// Importa Offcanvas de Bootstrap
import * as bootstrap from 'bootstrap'; 
const AdminLayout = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
   const role = actions.getUserRoleFromToken();
  const [activeContentComponent, setActiveContentComponent] = useState("dashboard");

 
  if (role !== "admin") return <Navigate to="/unauthorized" />;

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const handleSetActiveComponent = (componentName) => {
    setActiveContentComponent(componentName);
  };

  const handleCloseUpdateUserForm = () => {
    setActiveContentComponent("dashboard");
  };

  // NUEVA FUNCIÓN: Para cerrar el Offcanvas
  const closeOffcanvas = () => {
    const offcanvasElement = document.getElementById('adminSidebar');
    if (offcanvasElement) {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
      offcanvas.hide();
    }
  };

  // Función que se llama al hacer click en un ítem del offcanvas
  const handleMenuItemClick = (componentName, path) => {
    setActiveContentComponent(componentName);
    closeOffcanvas(); // Cierra el offcanvas
    
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar para escritorio  */}
      <div className="d-none d-md-flex flex-column bg-success text-white p-3" style={{ width: "220px" }}>
        <div className="sidebar-logo mb-4">
          <img src={logo} alt="Logo" className="logo img-fluid" />
        </div>
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to="/admin"
              className={`nav-link text-white d-flex align-items-center ${isActive("/admin") ? "fw-bold active-sidebar-link" : ""}`}
              onClick={() => setActiveContentComponent("dashboard")}
            >
              {isActive("/admin") && <i className="me-2 fas fa-tachometer-alt"></i>}
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/users"
              className={`nav-link text-white d-flex align-items-center ${isActive("/admin/users") ? "fw-bold active-sidebar-link" : ""}`}
              onClick={() => setActiveContentComponent("users")}
            >
              {isActive("/admin/users") && <i className="me-2 fas fa-users"></i>}
              Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/categories"
              className={`nav-link text-white d-flex align-items-center ${isActive("/admin/categories") ? "fw-bold active-sidebar-link" : ""}`}
              onClick={() => setActiveContentComponent("categories")}
            >
              {isActive("/admin/categories") && <i className="me-2 fas fa-tags"></i>}
              Categorías
            </Link>
          </li>
        </ul>

        <div className="mt-auto text-center">
          <img src={logo} alt="Logo" className="img-fluid mt-5" style={{ maxHeight: "60px" }} />
        </div>
      </div>

      {/* Offcanvas para móviles */}
      <div className="d-md-none">
        <button
          className="btn btn-success m-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#adminSidebar"
          aria-controls="adminSidebar"
        >
          ☰
        </button>
        <div className="offcanvas offcanvas-start bg-success text-white" tabIndex="-1" id="adminSidebar">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Admin Panel</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link text-white d-flex align-items-center ${isActive("/admin") ? "fw-bold active-sidebar-link" : ""}`}
               
                  onClick={() => handleMenuItemClick("dashboard", "/admin")}
                >
                  {isActive("/admin") && <i className="me-2 fas fa-tachometer-alt"></i>}
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/users"
                  className={`nav-link text-white d-flex align-items-center ${isActive("/admin/users") ? "fw-bold active-sidebar-link" : ""}`}
                  onClick={() => handleMenuItemClick("users", "/admin/users")}
                >
                  {isActive("/admin/users") && <i className="me-2 fas fa-users"></i>}
                  Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/categories"
                  className={`nav-link text-white d-flex align-items-center ${isActive("/admin/categories") ? "fw-bold active-sidebar-link" : ""}`}
                  onClick={() => handleMenuItemClick("categories", "/admin/categories")}
                >
                  {isActive("/admin/categories") && <i className="me-2 fas fa-tags"></i>}
                  Categorías
                </Link>
              </li>
            </ul>
            <div className="mt-auto text-center">
              <img src={logo} alt="Logo" className="img-fluid mt-4" style={{ maxHeight: "60px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal  */}
      <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ maxHeight: "100vh" }}>
        <div className="container-fluid p-4 pb-0">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <HeaderCardAdmin setActiveComponent={handleSetActiveComponent} />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <RadialProgressChart />
            </div>
            <div className="col-12 col-lg-4">
              <HeaderInfoCard />
            </div>
          </div>
        </div>

        <div className="container-fluid p-4 pt-0 flex-grow-1">
          {activeContentComponent === "edit-user" && (
            <HandleUpdateUser onClose={handleCloseUpdateUserForm} />
          )}

          {activeContentComponent === "dashboard" && location.pathname === "/admin" && (
            <>
              <div className="container-fluid px-0">
                <CalculadoraAhorro />
              </div>
              <Outlet />
            </>
          )}

          {activeContentComponent !== "edit-user" && location.pathname.startsWith("/admin") && (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;