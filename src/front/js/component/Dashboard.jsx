import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalBtn from "./PayPalBtn.jsx";
import WalletCard from "./WalletCard.jsx";
import AddWallet from "./AddWallet.jsx";
import AddRecord from "./AddRecord.jsx"
import { Context } from "../store/appContext";
import ConfirmModal from "./ConfrimModal.jsx";

const Dashboard = () => {

    /*
    ⚠️ Importante: el componente HandleUpdateUser necesita que se llame a actions.getUser() antes de renderizarse, para poder llenar correctamente el formulario con los datos del usuario.
    
    Actualmente, esa llamada está en el useEffect del componente Dashboard (justo debajo de este comentario).
    
    ✅ Si mueves el botón o renderizas HandleUpdateUser en otro lugar, asegúrate de incluir este useEffect completo para que el botón funcione correctamente y se cargue la información del usuario.
    */

    const navigate = useNavigate()
    const { store, actions } = useContext(Context);
    const [selectedWalletId, setSelectedWalletId] = useState(localStorage.getItem("selected_wallet"));
    const [walletToDelete, setWalletToDelete] = useState(null);


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login');
        } else {
            actions.getUser();
        }
    }, []);


    useEffect(() => {
        const fetchWallets = async () => {
            const response = await actions.getAllUserWallets()

            if (!response) {
                console.log("Parece que hubo un error o no hay wallets")
                return;
            }
        }
        fetchWallets();

    }, []);


    return (
        <div className="container my-3">
            <div id="header" className="">
                <h1>Dashboard User</h1>
                <h3>Convertirse en Premium!</h3>

                {/* Botón para navegar a HandleUpdateUser */}
                <button
                    className="btn btn-primary"
                    style={{ width: "200px" }}
                    onClick={() => navigate("/edit-user")}
                >
                    Editar Usuario
                </button>

                <div className="row">
                    <div className="col-3">
                        <PayPalBtn />
                    </div>
                    <div className="col-2 mt-4">
                        <AddWallet />
                    </div>





                </div>



            </div>

            <div className="row">
                {store.wallets_from_user && store.wallets_from_user.length > 0 ? (
                    store.wallets_from_user.map((wallet) => (
                        <div onClick={() => {
                            setSelectedWalletId(wallet.id);
                            localStorage.setItem("selected_wallet", wallet.id);
                            console.log(selectedWalletId)
                        }} className="col-lg-3 col-sm-4 col-sm-6 mb-3" key={wallet.id}>
                            <WalletCard
                                id={wallet.id}
                                balance={wallet.balance}
                                name={wallet.name}
                                currency={wallet.currency.symbol}
                                selectedWallet={selectedWalletId}
                                onDelete={() => setWalletToDelete(wallet.id)} // ← nuevo prop
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-3">
                        <p>No tienes wallets</p>
                        <AddWallet />
                    </div>
                )}
            </div>

            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <AddRecord />
                </div>
                <div className="text-center align-items-center my-auto col-lg-6 col-md-12">
                    Meter grafiquitas aca
                </div>
            </div>
            <ConfirmModal
                id="confirmDeleteModal"
                message="¿Estás seguro de que querés eliminar esta billetera?"
                onConfirm={async () => {
                    const success = await actions.deleteUserWallet(walletToDelete);
                    if (success) toast.success("Billetera eliminada");
                    else toast.error("Error al eliminar billetera");
                }}
                onCancel={() => setWalletToDelete(null)}
            />
        </div>
    )
};

export default Dashboard 