import React, { useState , useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Login = () => {
    const {actions,store} = useContext (Context)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate ()

    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log (email,password)
        let resp = true //aqui va el resultado del fetch del login
        if (resp) {
            navigate("/dashboard")
        }else {
            alert ("algo salio mal")
        }
    }

    return (
        <div className="container mt-3">

            <div className="row d-flex justify-content-center mt-5">
                <div className="col-4 d-flex justify-content-center">
                    <img style={{ width: "80%" }} src="https://img.freepik.com/vector-gratis/ilustracion-concepto-inicio-sesion_114360-739.jpg?semt=ais_hybrid&w=740" />
                </div>
                <div className="col-6">
                    <h1>Login</h1>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <button type="button" onClick={(e)=>handleSubmit(e)} className="btn btn-outline-primary">Login</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Login