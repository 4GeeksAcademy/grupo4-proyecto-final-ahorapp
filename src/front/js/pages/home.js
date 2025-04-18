import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";



export const Home = () => {
	const { store, actions } = useContext(Context);
	const [user, setUser] = useState(null); // Estado para controlar el usuario logueado
	const navigate = useNavigate ()
	// Función para simular login (reemplaza con tu lógica real)
	const handleLogin = () => {
		
		navigate("/dashboard")
	};

	// Función para logout
	const handleLogout = () => {
		setUser(null);
	};

	return (
		<div className="text-center mt-5">
			{user ? (
				/* --- DASHBOARD PARA USUARIO LOGUEADO --- */
				<div>
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h1>Bienvenido, {user.name}!</h1>
						<button
							onClick={handleLogout}
							className="btn btn-danger"
						>
							Cerrar sesión
						</button>

					</div>
					<h1>aca debo trabajar inicio de sesion</h1>
					<div className="card mb-4">
						<div className="card-body">
							<div className="alert alert-info">
								{store.message || "Mensaje del backend..."}
							</div>

							<h3>Tu Área Privada</h3>
							<p>Contenido exclusivo para usuarios autenticados</p>
						</div>
					</div>
				</div>
			) : (
				/* --- CONTENIDO PÚBLICO (tu código original) --- */
				<div>
					
					<button
						onClick={handleLogin}
						className="btn btn-primary mb-3"
					>
						Acceder al Dashboard
					</button>
				</div>
			)}
		</div>
	);
};