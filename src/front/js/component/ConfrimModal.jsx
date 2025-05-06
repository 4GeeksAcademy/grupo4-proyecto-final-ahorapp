import React from "react";

const ConfirmModal = ({ id = "confirmModal", message, onConfirm, onCancel }) => {
    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>¿Estás seguro?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    <div className="modal-body">
                        {message || "¿Quieres continuar con esta acción?"}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onCancel}>
                            No
                        </button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onConfirm}>
                            Sí
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
