import React, { useEffect, useState, useContext } from "react";
// Suponiendo que tienes un contexto donde está getGoalProgress
import { Context } from "../store/appContext";

const SavingsGoals = () => {
    const { store, actions } = useContext(Context);
    //const [metas, setMetas] = useState(store.goals);
    const [goalIds, setGoalIds] = useState ([]);



    useEffect (() => {
        
        const fetchData=async () =>{
            try {
                let resp = await actions.getGoalProgress()
                //await actions.getGoalProgress()
                console.log(store.goalProgress)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
        
    },[])

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

            {store.goalProgress.map((goal, index) => {


                return (
                    <div key={index} style={{
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
                                color: goal.progress === 100 ? "#28a745" : "#007bff"
                            }}>
                                {goal.progress}%
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
                                width: `${goal.progress}%`,
                                height: "100%",
                                backgroundColor: goal.progress === 100 ? "#28a745" : "#17a2b8",
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
                            <span>Ahorrado: <strong>${goal.remaining.toLocaleString()}</strong></span>
                            <span>Meta: <strong>${goal.goal_value.toLocaleString()}</strong></span> 
                        </div>

                        {/* Mensaje si está completo */}
                        {goal.progress === 100 && (
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
