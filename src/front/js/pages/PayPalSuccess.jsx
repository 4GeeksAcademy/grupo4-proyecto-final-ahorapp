import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const PayPalSuccess = () => {
  const { actions } = useContext(Context);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Procesando el pago...");
  const navigate = useNavigate();

  useEffect(() => {
    const capturePayment = async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      try {
        const response = await actions.captureOrderPayPal(token);

        if (response?.status === "COMPLETED") {
          setStatus("success");
          setMessage("✅ ¡Pago confirmado con éxito!");

          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          setStatus("error");
          setMessage("⚠️ El pago no se completó.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Ocurrió un error al procesar el pago.");
      }
    };

    capturePayment();
  }, []);

  useEffect(() => {
    if(!localStorage.getItem("token")){
        navigate("/login")
    }
  }, []);

  return (
    <div className="container text-center mt-5">
      {status === "loading" && (
        <>
          Cargando...
          <h4>{message}</h4>
        </>
      )}

      {status === "success" && (
        <>
          <h2 className="text-success">{message}</h2>
          <p>Redirigiendo a tu dashboard...</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="text-danger">{message}</h2>
          <p>Si el problema persiste, contactanos.</p>
        </>
      )}
    </div>
  );
};

export default PayPalSuccess;
