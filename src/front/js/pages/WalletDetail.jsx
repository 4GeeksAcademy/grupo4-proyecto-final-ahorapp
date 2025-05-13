// views/WalletDetail.js
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import ListRecord from "../component/ListRecord.jsx";
import SpinnerLogo from "../component/SpinnerLogo.jsx";


const WalletDetail = () => {
  const { store, actions } = useContext(Context);
  const { wallet_id } = useParams()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordsWallet = async (wallet_id) => {
      setLoading(true)
      const response = await actions.get_records(null, null, wallet_id);

      if (!response) {
        console.error("Error al intentar traer los registros de esta wallet.")
        return;
      }
      setLoading(false);
    }

    fetchRecordsWallet(wallet_id);
    setLoading(false);

  }, [wallet_id]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2">
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title fs-4 text-primary">Saldo Actual</h5>
              {loading ? (

                <SpinnerLogo />
              ) : (
                <h2 className="display-5 fw-bold">
                  ${store.wallets_from_user.find(wallet => wallet.id === parseInt(wallet_id))?.balance?.toFixed(2) || "0.00"}
                </h2>
              )}


            </div>
          </div>

          <h4 className="mb-3 text-center text-md-start">Historial de Movimientos</h4>
          <ListRecord />
        </div>
      </div>
    </div>
  );
};

export default WalletDetail;
