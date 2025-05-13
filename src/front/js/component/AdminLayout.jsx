import React, { useContext } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";


const AdminLayout = () => {
  const { store, actions } = useContext(Context);
  const role = actions.getUserRoleFromToken();

  if (role !== "admin") return <Navigate to="/unauthorized" />;

  return (
    <div className="d-flex">
      {/* Sidebar fijo en desktop */}
      <div className="d-none d-md-flex flex-column bg-success text-white vh-100 p-3" style={{ width: "220px" }}>
        <h4 className="mb-4">Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to="/admin"
              className={`nav-link text-white ${location.pathname === "/admin" ? "fw-bold" : ""}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/users"
              className={`nav-link text-white ${location.pathname.includes("/admin/users") ? "fw-bold" : ""}`}
            >
              Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/categories"
              className={`nav-link text-white ${location.pathname.includes("/admin/categories") ? "fw-bold" : ""}`}
            >
              Categorías
            </Link>
          </li>
        </ul>
        <div className="mt-auto text-center">
          <img src={logo} alt="Logo" className="img-fluid mt-5" style={{ maxHeight: "60px" }} />
        </div>
      </div>

      {/* Sidebar móvil con botón toggle */}
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
            <h5 className="offcanvas-title">Admin</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link text-white ${location.pathname === "/admin" ? "fw-bold" : ""}`}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/users"
                  className={`nav-link text-white ${location.pathname.includes("/admin/users") ? "fw-bold" : ""}`}
                >
                  Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/categories"
                  className={`nav-link text-white ${location.pathname.includes("/admin/categories") ? "fw-bold" : ""}`}
                >
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

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
