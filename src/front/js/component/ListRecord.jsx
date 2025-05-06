import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";


const ListRecord = () => {

    const { store, actions } = useContext(Context);
    const { wallet_id } = useParams();
    let records = store.records
    const [loading, setLoading] = useState(true)

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
        setLoading(false);


        return () => {
            isMounted = false;
        }
    }, [])
    return (
        <div>
            <h2>Registros</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Descripcion</th>
                            <th>Monto</th>
                            <th>Categoria</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="4">
                                    <div className="d-flex justify-content-center mx-auto my-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {records && records.length > 0 ? (
                            records.map((record, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{record.description}</td>
                                    <td className={record.amount < 0 ? "text-danger" : "text-success"}>${parseFloat(record.amount).toFixed(2)}</td>
                                    <td>{record.category.name}</td>
                                    <td>{new Date(record.timestamp).toLocaleString("es-UY")}</td>
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