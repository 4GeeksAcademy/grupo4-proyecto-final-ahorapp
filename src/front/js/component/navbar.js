import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const Navbar = () => {

	const { store, actions } = useContext(Context);
	const role = actions.getUserRoleFromToken();

	const [isVisible, setIsVisible] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const currentTheme = store.theme;

	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsLoggedIn(false)
		navigate('/')
	}


	useEffect(() => {
		setIsVisible(true);
	}, []);

	useEffect(() => {
		setIsLoggedIn(!!localStorage.getItem("token"))
	}, [])

	useEffect(() => {
		if (localStorage.getItem("token")) {
			actions.getUser();
		}
	}, []);


	return (
		<nav className={`navbar navbar-expand-lg ${currentTheme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow-sm animated-navbar ${isVisible ? "fade-slide" : ""}`}>
			<div className="container">
				<Link className="navbar-brand text-success fw-bold" to="/">
					AhorrApp
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto align-items-center">

						{/* Cambiar tema oscuro/claro */}
						<li className="nav-item">
							<button
								className="btn btn-outline-secondary mx-2"
								onClick={() => actions.setTheme(currentTheme === "light" ? "dark" : "light")}
							>
								{currentTheme === "dark" ? <i className="fas fa-sun" /> : <i className="fas fa-moon" />}
							</button>
						</li>

						{localStorage.getItem("token") ? (
							// Dropdown perfil
							<li className="nav-item dropdown">
								<button
									className="btn nav-link dropdown-toggle d-flex align-items-center"
									id="userDropdown"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<i className="fas fa-user-circle fa-lg me-2" />
									<span>{store.currentUser.name}</span>
								</button>
								<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
									{store.currentUser?.is_premium && (
										<li className="dropdown-item">
											<i className="fas fa-gem me-2" style={{ color: "gold" }} title="Usuario Premium"></i>
											Premium
										</li>
									)}
									<li className="nav-item">
										<Link className="dropdown-item" to="/edit-user">Editar Perfil</Link>
									</li>
									<li>
										<Link className="dropdown-item" to="/dashboard">Dashboard</Link>
									</li>
									<li>
										<Link className="dropdown-item" to="/records/add">Registros</Link>
									</li>
									{role === "admin" && (
										<li>
											<Link className="dropdown-item" to="/admin">Admin</Link>
										</li>
									)}
									<li>
										<hr className="dropdown-divider" />
									</li>
									<li>
										<button className="dropdown-item text-danger" onClick={handleLogout}>
											Salir
										</button>
									</li>
								</ul>
							</li>
						) : (
							<>
								<li className="nav-item">
									<Link className="nav-link" to="/login">Ingresar</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link btn btn-register px-3 ms-2" to="/signup">
										Registrarse
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};