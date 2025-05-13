import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";


export const Home = () => {
	return (
		<div className="container py-5">
		{/* Header */}
		<header className="d-flex justify-content-between align-items-center mb-5">
			<h1 className="text-success">AhorrApp</h1>
		</header>

		{/* Hero */}
		<section className="text-center mb-5">
		<h2 className="display-4 fw-bold mb-3" style={{ color: "var(--bs-heading-color)" }}>Tomá el control de tu dinero</h2>
			<p className="lead text-muted mb-4">
				Organizá tus gastos, ahorrá inteligentemente y alcanzá tus metas financieras con AhorrApp.
			</p>
			<a href="/signup" className="btn btn-lg btn-success">Empezar ahora</a>
		</section>

		{/* Imagenes */}
		<section className="row text-center mb-5">
			<div className="col-md-4 mb-4">
				<img src="https://images.pexels.com/photos/4386326/pexels-photo-4386326.jpeg?auto=compress&cs=tinysrgb&w=600" 
					className="img-fluid rounded shadow-sm" 
					alt="Ahorros" />
			</div>
			<div className="col-md-4 mb-4">
				<img src="https://images.pexels.com/photos/4386374/pexels-photo-4386374.jpeg?auto=compress&cs=tinysrgb&w=600" 
					className="img-fluid rounded shadow-sm" 
					alt="Finanzas" />
			</div>
			<div className="col-md-4 mb-4">
				<img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600" 
					className="img-fluid rounded shadow-sm " 
					alt="Equipo" />
			</div>
		</section>
	</div>
	)
};