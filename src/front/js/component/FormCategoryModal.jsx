import React, { useEffect } from "react";

const FormCategoryModal = ({id="editCtegoryModal", message, onConfirm, onCancel, name, description, onChangeName, onChangeDescription}) => {

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>{message}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Nombre</label>
                                <input type="text" className="form-control" value={name} onChange={onChangeName}  id="categoryName" placeholder="Ej: Transporte" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryDescription" className="form-label">Descripción</label>
                                <input type="text" className="form-control" value={description} onChange={onChangeDescription} id="categoryDescription" placeholder="Ej: Gastos relacionados al transporte" />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onCancel}>Cancelar</button>
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={onConfirm}>Aceptar</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default FormCategoryModal;