import React from 'react'

const AddGoal = ({id = "addGoal", onCancel, onConfirm, name, value,onChangeName, onChangeValue }) => {
  return (
    <div>
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Añadir Meta de Ahorro</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="goalName" className="form-label" >Nombre de Meta</label>
                                <input type="text" className='form-control' value={name} onChange={onChangeName} id='goalName'placeholder="Ej: Nuevo Auto"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="goalValue" className="form-label">Meta a Alcanzar</label>
                                <input type="number" className='form-control' value={value} onChange={onChangeValue} id='goalValue'placeholder="Ej: 500"/>
                            </div>
                        </form>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onCancel}>Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={onConfirm}>Aceptar</button>
                    </div>
                </div>
            </div>
        </div>


    </div>
  )
}

export default AddGoal