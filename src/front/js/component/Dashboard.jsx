import React, { useState , useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Dashboard = () => {
    const { store , actions } = useContext(Context);

    return (
        <div className="container py-4">
            
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Bienvenido</h2>
                
            </div>
{/*
            <div className="alert alert-info">
                {store.message || "Mensaje del sistema"}
            </div>
            
            <div className="card">
                <div className="card-body">
                    <p>Contenido exclusivo para usuarios registrados</p>
                </div>
            </div> */}
        </div>
    );
};

// Versión que incluye manejo de autenticación
// export const AuthDashboard = () => {
//     const [user, setUser] = useState("usuario@ejemplo.com"); // Cambia por tu estado real

//     if (!user) return <div className="container py-4">Por favor inicia sesión</div>;

//     return (
//         <Dashboard
//             userEmail={user}
//             onLogout={() => {
//                 // Aquí puedes agregar lógica adicional antes del logout
//                 setUser(null);
//             }}
//         />
//     );
// };  ctrl+k+c