import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode"; 
import { Context } from "../store/appContext";

const HeaderInfoCard = () => {
    const { store, actions } = useContext(Context);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !hasFetched && store.totalUsersCount === null) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.role === "admin") {
                    actions.getUsersCount();
                    setHasFetched(true);
                }
            } catch (error) {
                console.error("Error al decodificar el token", error);
            }
        }
    }, [actions, store.totalUsersCount, hasFetched]);

    const totalUsuarios = store.totalUsersCount !== null ? store.totalUsersCount : "Cargando...";

    return (
        <div
            className="card shadow-sm border-light"
            style={{ maxWidth: "300px", position: "relative", zIndex: 1, overflow: "visible" }}
        >
            <div className="card-body d-flex flex-column align-items-start p-3">
                <div className="d-flex align-items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people-fill text-primary me-2" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                    <h6 className="card-subtitle mb-0">Usuarios Registrados</h6>
                </div>
                <h3 className="card-title fw-bold mb-0">{totalUsuarios}</h3>
                <p className="card-text text-success mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up me-1" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5..." />
                    </svg>
                    11.07%
                </p>
            </div>
        </div>
    );
};

export default HeaderInfoCard;



