import React, { useState, useEffect, useContext } from "react";
import logo from "../../img/logo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



const Signup = () => {

  const { store, actions } = useContext(Context);




  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()



  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;

    if (password !== confirmPassword) {
      toast.error("Las constrasenas no coinciden 😱");
      return;
    } else if (!emailRegex.test(email)) {
      toast.warn("El correo no tiene un formato válido 🤷‍♂️");
      return;
    } else if (password.length < 8) {
      toast.warn("La contrasena debe ser de al menos 8 caracteres 😒")
    }

    setLoading(true);
    const success = await actions.signup(name, email, password);
    setLoading(false);

    if (success) {
      toast.success("Registrado exitosamente! 😍")
      navigate("/dashboard");
    } else {
      toast.error("Hubo un error al intetnar crear el usuario 😓");
      setLoading(false);

    }

  }

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center mt-3">
          <img
            src={logo}
            alt="Logo de AhorrApp"
            className="img-fluid"
            style={{ maxHeight: "220px", objectFit: "contain" }}
          />
        </div>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Crear cuenta</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nombre de usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Ingresá tu nombre de usuario"
                required
                value={name}
                onChange={(e) => { setName(e.target.value) }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="ejemplo@correo.com"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Mínimo 8 caracteres"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Repetí la contraseña"
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value) }}
              />
            </div>


            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}

            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
