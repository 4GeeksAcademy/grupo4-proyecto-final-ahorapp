import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLogo from "./SpinnerLogo.jsx";



const ListRecord = () => {

    const { store, actions } = useContext(Context);
    const { wallet_id } = useParams();
    let records = store.records
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([]);

    const [editId, setEditId] = useState(null);
    const [description, setDescription] = useState(null)
    const [amount, setAmount] = useState(null);
    const [cat_id, setCat_id] = useState(null)

    const handleEditRecord = async (editId, description, amount, cat_id) => {
        try {
            console.log(editId, description, amount, cat_id)
            const response = await actions.editRecord(editId, description, amount, cat_id)

            if (response) {
                toast.success("Registro editado correctamente")
                cleanUpState();
                return

            } else {
                toast.error("No se pudo editar el registro")
                cleanUpState();
                return;

            }
        } catch (error) {
            toast.error("Error, algo salio mal en el componente")
            cleanUpState();


        }
    }

    const cleanUpState = () => {
        setEditId(null);
        setDescription(null);
        setAmount(null);
        setCat_id(null);

    }


    const handleDeleteRecord = async (recordId) => {
        const result = await actions.deleteRecord(recordId)

        if(result){
            toast.success("Registro eliminado correctamente");
            return;
        }else{
            toast.error("No se pudo eliminar el registro")
            return;
        }
    }

    useEffect(() => {

        let isMounted = true;

        const fetchRecords = async () => {
            setLoading(true);

            const success = await actions.get_records(null, null, wallet_id);
            if (success && isMounted) {
                records = store.records
                setLoading(false)
            }
        }

        fetchRecords();


        return () => {
            isMounted = false;
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await actions.getCategories();

                if (!data) {
                    console.log("No hay categorias")
                    setLoading(false)
                    return;
                }

                setCategories(store.categories_db)
                setLoading(false)
                return;

            } catch (error) {
                console.error(`Hubo un error al intentar traer las categorias: ${error}`)
                setLoading(false)
            }
        }

        fetchCategories()
    }, []);

    return (
        <div className="">
            <h2>Registros</h2>
            <div className="table-responsive card p-3 shadow rounded-2">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Descripcion</th>
                            <th>Monto</th>
                            <th>Categoria</th>
                            <th>Fecha</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5">
                                    <SpinnerLogo />
                                </td>
                            </tr>
                        ) : store.records.length > 0 ? (
                            store.records.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    {editId === record.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    defaultValue={record.description}
                                                    onChange={(e) => { setDescription(e.target.value) }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    defaultValue={record.amount}
                                                    onChange={(e) => { setAmount(e.target.value) }}
                                                />
                                            </td>
                                            <td>
                                                <select className="form-select" defaultValue={record.category.id} onChange={(e) => { setCat_id(e.target.value) }}>
                                                    {store.categories_db.map((cat, i) => (
                                                        <option key={i} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{new Date(record.timestamp).toLocaleString("es-UY")}</td>
                                            <td>
                                                <button
                                                    className="btn"
                                                    role="button"
                                                    onClick={() => {
                                                        handleEditRecord(editId, description, amount, cat_id)
                                                    }}
                                                >
                                                    ✅
                                                </button>
                                                <button className="btn" role="button"
                                                    onClick={() => cleanUpState()}
                                                >
                                                    ❌
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{record.description}</td>
                                            <td className={record.amount < 0 ? "text-danger" : "text-success"}>
                                                ${parseFloat(record.amount).toFixed(2)}
                                            </td>
                                            <td>{record.category.name}</td>
                                            <td>{new Date(record.timestamp).toLocaleString("es-UY")}</td>
                                            <td>
                                                <i
                                                    className="fas fa-trash me-3 text-danger"
                                                    role="button"
                                                    onClick={() => handleDeleteRecord(record.id)}
                                                />
                                                <i
                                                    className="fas fa-pen text-primary"
                                                    role="button"
                                                    onClick={() => setEditId(record.id)}
                                                />
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-3">
                                    No hay registros todavía.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ListRecord;