import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import WalletModal from "./WalletModal.jsx"
import { toast } from "react-toastify";

const AddWallet = () => {

    const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [initialValue, setInitialValue] = useState(0);
    const [currency, setCurrency] = useState("")

    const handleAddWallet = async (e) => {

        if (name == "" || initialValue <= 0 || currency == "") {
            console.log(name, initialValue, currency)
            toast.warn("Debe ingresar todos los campos o el monto debe ser mayor a 0.")
            setName("")
            setCurrency("")
            return;
        }
        const response = await actions.addUserWallet(name, initialValue, currency)
        if (response == "403") {
            toast.error("No puedes tener mas de 2 billteras si no eres Premium")
            return;
        }
        if (!response) {
            toast.error(`Hubo un error al intentar crear la billetera ${name}`)
            setName("");
            setCurrency("");
            return;
        } else {
            toast.success(`Billetera ${name} creda exitosamente!`)
            setName("");
            setCurrency("");
            return;
        }
    }

    useEffect(() => {
    }, []);

    return (
        <div >
            <i className="ms-2 fa-solid fa-circle-plus fs-3 text-success"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#createWalletModal"></i>

            <WalletModal
                id="createWalletModal"
                message="Crea una nueva billetera"
                onCancel={() => {
                    setName("")
                    setCurrency("")
                    setInitialValue(0)

                }}
                onConfirm={() => { handleAddWallet() }}
                name={name}
                initialValue={initialValue}
                currency={currency}
                onChangeName={(e) => setName(e.target.value)}
                onChangeInitialValue={(e) => setInitialValue(parseInt(e.target.value))}
                onChangeCurrency={(e) => setCurrency(e.target.value)}
                select={store.currencies}
            />
        </div>
    );
}

export default AddWallet;