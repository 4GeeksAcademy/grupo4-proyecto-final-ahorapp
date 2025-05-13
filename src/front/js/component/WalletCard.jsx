import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const WalletCard = ({ id, balance, name, currency, selectedWallet, onDelete }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate()


  const handleWalletDetails = (id) => {
    navigate(`/wallet/${id}`)

  }

  return (
    <div className={`card text-white bg-success shadow-md ${id == selectedWallet ? 'border-neon' : ''}`} role="button" style={{ minWidth: "200px", position: "relative" }}>
      <div className="card-body text-center">
        <button
          className="btn position-absolute top-0 end-0 m-2"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(); // ← setea el ID que vamos a borrar
          }}
          data-bs-toggle="modal"
          data-bs-target="#confirmDeleteModal"
        >
          ❌
        </button>

        <h5 className="card-title">{name}</h5>
        <h2 className={`display-6 fw-bold  ${id==selectedWallet? "" : "d-none d-md-block"}`}>{currency} {balance?.toFixed(2) || "0.00"}</h2>
        <p onClick={() => { handleWalletDetails(id) }} className={`card-title ${id==selectedWallet? "" : "d-none d-md-block"}`}>Ver detalles</p>
      </div>
    </div>
  );
};

export default WalletCard;
