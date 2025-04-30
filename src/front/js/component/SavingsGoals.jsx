import React, { useEffect, useState, useContext } from "react";
// Suponiendo que tienes un contexto donde está getGoalProgress
import { Context } from "../store/appContext";

const SavingsGoals = () => {
    const { actions } = useContext(Context);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        // Simulamos IDs de metas que quieres consultar
        const goalIds = [1, 2, 3];

        // Función para traer datos reales
        const fetchGoals = async () => {
            const fetchedGoals = [];

            for (const id of goalIds) {
                const data = await actions.getGoalProgress(id);
                if (data) {
                    fetchedGoals.push({
                        id: data.id,
                        name: data.name,
                        target: data.target,
                        saved: data.saved
                    });
                }
            }

            setGoals(fetchedGoals);
        };

        fetchGoals();
    }, [actions]);

    return (
        <div style={{
            maxWidth: "600px",
            margin: "20px auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px"
        }}>
            <h2 style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "30px"
            }}>
                Progreso de Ahorros
            </h2>

            {goals.map((goal) => {
                const percentage = Math.round((goal.saved / goal.target) * 100);

                return (
                    <div key={goal.id} style={{
                        marginBottom: "25px",
                        padding: "15px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px"
                        }}>
                            <h3 style={{ margin: "0", color: "#444" }}>{goal.name}</h3>
                            <span style={{
                                fontWeight: "bold",
                                color: percentage === 100 ? "#28a745" : "#007bff"
                            }}>
                                {percentage}%
                            </span>
                        </div>

                        {/* Barra de progreso */}
                        <div style={{
                            height: "10px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "5px",
                            marginBottom: "8px"
                        }}>
                            <div style={{
                                width: `${percentage}%`,
                                height: "100%",
                                backgroundColor: percentage === 100 ? "#28a745" : "#17a2b8",
                                borderRadius: "5px"
                            }} />
                        </div>

                        {/* Montos */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "14px",
                            color: "#666"
                        }}>
                            <span>Ahorrado: <strong>${goal.saved.toLocaleString()}</strong></span>
                            <span>Meta: <strong>${goal.target.toLocaleString()}</strong></span>
                        </div>

                        {/* Mensaje si está completo */}
                        {percentage === 100 && (
                            <p style={{
                                margin: "10px 0 0",
                                color: "#28a745",
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>
                                ¡Meta alcanzada!
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SavingsGoals;
