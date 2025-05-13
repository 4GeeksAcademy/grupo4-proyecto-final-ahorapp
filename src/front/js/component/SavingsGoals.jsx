import React, { useEffect, useState, useContext } from "react";
// Suponiendo que tienes un contexto donde está getGoalProgress
import { Context } from "../store/appContext";
import  AddGoal  from "./AddGoal.jsx"
import { toast } from "react-toastify";

const SavingsGoals = () => {
    const { store, actions } = useContext(Context);
    const [goalName, setGoalName] = useState("");
    const [goalValue, setGoalValue] = useState(0);
    const [goalIds, setGoalIds] = useState ([]);

    const handleDeleteGoal = async(id) => {
        try {
            const result = await actions.deleteGoal(id)
            if (!result){
                toast.error(`Hubo un error al intentar borrar la meta`)
                return;

            }
            toast.success(`Meta borrada con exito`)


        } catch (error) {
            console.error("Ocurrio el siguiente error: ", error)
            
        }
    }


    const handleAddGoal = async()=>{

        if(goalName == "" || goalValue < 0){
            toast.warn("Debe ingresar todos los campos o el monto debe ser mayor a 0.")
            setGoalName("")
            setGoalValue(0)
            return;
        }

        const result = await actions.setGoal(goalName,goalValue)

        if(result == "403"){
            toast.error(`El usuario no es premium y no puede crear mas de 3 metas`)
            return;
        }

        if(!result){
            toast.error(`Hubo un error al intentar crear la meta ${goalName}`)
            setGoalName("")
            setGoalValue(0)
            return;
        } else {
            toast.success(`Meta de Ahorro ${goalName} creada exitosamente!`)
            setGoalName("")
            setGoalValue(0)
            setIsModalOpen(false)
            return;
        }
    }
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
        
    },[store.goals])

    return (
        <div className="card shadow rounded-2 mt-3">
            <h2 style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "2vh",
                marginTop: "1vh"
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
                                <div className="d-flex flex-row justify-content-center align-items-center">
                                <span style={{
                                    fontWeight: "bold",
                                    color: goal.progress === 100 ? "#28a745" : "#007bff"
                                        }}>
                                {goal.progress}%
                                </span>

                                    <i
                                    className="fas fa-trash me-3 text-danger ms-1"
                                    role="button"
                                    onClick={() => handleDeleteGoal(goal.id)}
                                />
                                
                                </div>
                                                   

                        </div>

                        {/* Barra de progreso */}
                        <div style={{
                            height: "10px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "5px",
                            marginBottom: "8px"
                        }}>
                            <div style={{
                                width: `${goal.progress >= 100? 100 : goal.progress}%`,
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
                            <span>Restante: <strong>${goal.remaining.toLocaleString() < 0 ? goal.goal_value.toLocaleString() - goal.remaining.toLocaleString() : goal.remaining.toLocaleString() }</strong></span>
                            <span>Meta: <strong>${goal.goal_value.toLocaleString()}</strong></span> 
                        </div>

                        {/* Mensaje si está completo */}
                        {goal.progress >= 100 && (
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

        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addGoal">
            Añadir Meta de Ahorro
        </button>
        
        <AddGoal 
            id = "addGoal"
            onCancel = {()=> {
            setGoalName("")
            setGoalValue(0)
            }}
            onConfirm = {handleAddGoal}
            name = {goalName}
            value = {goalValue}
            onChangeName={(e) => setGoalName(e.target.value)}
            onChangeValue={(e) => setGoalValue(e.target.value)}

            />
        
        </div>
    );
};

export default SavingsGoals;
