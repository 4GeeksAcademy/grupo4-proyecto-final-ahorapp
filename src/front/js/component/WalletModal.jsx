import React from "react";

const WalletModal = ({ id = "addWalletModal", message, onConfirm, onCancel, name, initialValue, currency, select, onChangeName, onChangeInitialValue, onChangeCurrency }) => {
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
                                <label htmlFor="walletName" className="form-label">Nombre</label>
                                <input type="text" className="form-control" value={name} onChange={onChangeName} id="walletName" placeholder="Ej: Vacaciones" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="walletValue" className="form-label">Valor inicial</label>
                                <input type="number" className="form-control" value={initialValue} onChange={onChangeInitialValue} id="walletValue" placeholder="Ej: 5000" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="currencySelect" className="form-label">Moneda</label>
                                <select
                                    className="form-select"
                                    id="currencySelect"
                                    value={currency}
                                    onChange={onChangeCurrency}
                                >
                                    <option value="">Selecciona una moneda</option>
                                    {select.map((s, i)=>(
                                        <option key={i} value={s.id}>{s.name}</option>                                        
                                    ))}
                                </select>
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
    );
}

export default WalletModal;