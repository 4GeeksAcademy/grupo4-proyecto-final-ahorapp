import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";


export const Dashboard = () => {
const navigate = useNavigate()


useEffect(()=>{
    if (!localStorage.getItem("token")) {
        navigate('/login')
    }
},[])


    return (
        <div className="container justify-content-center">
            <div>
                <h1>welcome to your wallet Name User (monto/sueldo)</h1>
            </div>

            <select className="form-select form-select-sm" aria-label="Small select example" style={{ marginTop: "20px" }}>
                <option selected>Select the Category</option>
                <option value="1">Alquiler</option>
                <option value="2">Comida</option>
                <option value="3">Otros</option>
            </select>

            <select className="form-select form-select-sm" aria-label="Small select example" style={{ marginTop: "20px" }}>
                <option selected>Amount</option>
                <option value="1">10</option>
                <option value="2">20</option>
                <option value="3">Otro Monto</option>
            </select>

            <select className="form-select form-select-sm" aria-label="Small select example" style={{ marginTop: "20px" }}>
                <option selected>Type of Currency</option>
                <option value="1">$</option>
                <option value="2">€</option>
                <option value="3">Otros</option>
            </select>

            <div>

                <button type="button" className="btn btn-outline-primary" style={{ width: "18rem", marginTop: "20px" }}>Load Data</button>

            </div>

            <div>
                <div className="card" style={{ width: "18rem", marginTop: "20px" }}>
                    <div className="card-header">
                        payment summary (dia/mes/año)
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">category:</li>
                        <li className="list-group-item">amount:</li>
                        <li className="list-group-item">currency:</li>
                    </ul>
                    <div className="card-footer">Total: 20$ (ejemplo) <i className="fa-brands fa-cc-diners-club"></i>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard 