import React from "react";
import { useNavigate } from "react-router-dom";

const PayPalCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h2 className="text-warning">⚠️ Pago cancelado</h2>
      <p>Parece ser que cancelaste el pago en PayPal. Si fue un error, podés intentarlo de nuevo.</p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
};

export default PayPalCancel;
