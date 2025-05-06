import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../store/appContext";
import ConfirmModal from './ConfrimModal.jsx';
import { toast } from "react-toastify";

const ListUsers = () => {
    const { store, actions } = useContext(Context);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [userToDelete, setUserToDelete] = useState(null)


    const handleDelete = async (id) => {

        const response = await actions.deleteUser(id);

        if(response == "403"){
            toast.error("No puedes eliminar tu propio usuario")
            return;
        }

        if (!response) {
            toast.error("No se pudo eliminar el usuario")
            return;
        } else {
            toast.success("El usuario ha sido eliminado correcamente")
            setUsers(store.users)
        }


    }

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await actions.getUsers();
            if (!response) {
                 console.log("No se pudieron traer los usuarios desde la BD.")
                 setLoading(false)
                 return users;
             }

            setUsers(store.users)
            setLoading(false)
        }

        fetchUsers();


    }, []);
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Usuarios</h2>
            <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Billeteras</th>
                            <th>Último Login</th>
                            <th>Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6">
                                    <div className="d-flex justify-content-center my-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <i
                                            className="fas fa-trash delete-fa show me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#confirmDeleteModal"
                                            role="button"
                                            onClick={() => setUserToDelete(user.id)}
                                        ></i>
                                        {user.name}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.wallets.length}</td>
                                    <td>{new Date(user.last_login).toLocaleString('es-UY')}</td>
                                    <td>
                                        <span className={`badge ${user.is_premium ? 'bg-success' : 'bg-secondary'}`}>
                                            {user.is_premium ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                id="confirmDeleteModal"
                message="¿Estás seguro de que quieres eliminar este usuario?"
                onConfirm={() => handleDelete(userToDelete)}
                onCancel={() => setUserToDelete(null)}
            />
        </div>
    );

}

export default ListUsers;