import React, { useState, useContext, useEffect } from "react";
import ListRecord from "./ListRecord.jsx";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AddRecord = () => {
    const { store, actions } = useContext(Context);
    const [inputValue, setInputValue] = useState("");
    const [totalValueWallet, setTotalValueWallet] = useState(0)
    const navigate = useNavigate()

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const singularize = (word) => {
        if (word.endsWith('s') && word.length > 3) {
            return word.slice(0, -1);
        }
        return word;
    };


    const handleRecord = async (inputValue, categories) => {
        const amountMatch = inputValue.match(/-?\d+(\.\d+)?/);
        const amount = amountMatch ? parseFloat(amountMatch[0]) : null;
        const words = inputValue
            .replace(/[+-]?\d+(\.\d+)?/, "")
            .toLowerCase()
            .split(/\s+/)
            .map(removeAccents)
            .map(singularize);

        let matchedCategory = "General";
        let type = amount < 0 ? "Gasto" : "Ingreso";

        for (const [category, keywords] of Object.entries(categories)) {
            if (words.some(word => keywords.includes(word))) {
                matchedCategory = category;
                break;
            }
        }

        console.log(amount, matchedCategory, words.join(" "))
        setInputValue("")

        // const response = await actions.addRecord(words.join(" "), amount, type, matchedCategory, localStorage.getItem("selected_wallet"))
        const response = await actions.addRecord(words.join(" "), amount, type, null, localStorage.getItem("selected_wallet"))

        if (!response) {
            console.log("Hubo un error al intentar agregar el registro.")
            toast.warn("Debes agregar una breve descripcion y un monto");

            return;
        }
        toast.success("Registro agregado exitosamente!");
        console.log(store.logged_user)

    };

    useEffect(() => {
        let totalValue = 0
        if (store.wallets_from_user && store.wallets_from_user.length > 0) {
            for (let i = 0; i < store.wallets_from_user.length; i++) {
                totalValue = totalValue + store.wallets_from_user[i].balance;
            }
            setTotalValueWallet(totalValue)
        }

        return () => {
            setTotalValueWallet(0)
        }
    }, [store.records])

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login')
        }
    }, [])

    return (
        <div className="container mt-4">
            <div className="row d-flex">
                <ListRecord />
                {/* <h3 className="mt-3">Tienes ${totalValueWallet} disponibles</h3>Se quita esto por ahora dado que las currencies son diferentes */}
            </div>
            <div className="row d-flex">
                <h5 className="my-3">Ingresa tu registro</h5>
                <div className="input-group col-4 ">
                    <button onClick={() => { handleRecord(inputValue, store.categories) }} className="btn btn-custom" type="button">
                        ➕
                    </button>
                    <input
                        onChange={(e) => { setInputValue(e.target.value) }}
                        onKeyDown={(e) => { e.key === "Enter" ? handleRecord(inputValue, store.categories) : "" }}
                        type="text"
                        className="form-control card shadow rounded-2"
                        placeholder="-250 comida con la banda"
                        value={inputValue}
                    />
                </div>
            </div>
        </div>
    )
}

export default AddRecord;