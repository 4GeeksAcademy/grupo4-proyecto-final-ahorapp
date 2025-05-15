import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { toast } from "react-toastify";

const HandleUpdateUser = () => {
    const { store, actions } = useContext(Context);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    // Obtener usuario al montar el componente
    useEffect(() => {
        actions.getUser();
    }, []);

    // Cargar datos del usuario en el formulario
    useEffect(() => {
        if (store.currentUser) {
            setFormData({
                name: store.currentUser.name || "",
                email: store.currentUser.email || "",
                password: "",
                phone: store.currentUser.phone || "",
                address: store.currentUser.address || ""
            });
        }
    }, [store.currentUser]);

    // Manejar clic en actualizar
    const handleUpdateUser = async () => {

        if (formData.email === "" || formData.name === ""){
            toast.error("No puedes dejar los campos email y nombres vacios.")
            return;
        }

        try {
            const actualizado = await actions.updateUser(
                formData.name,
                formData.email,
                formData.password,
                formData.phone,
                formData.address
            );

            if (actualizado) {
                console.log("✅ Usuario actualizado correctamente. Refrescando datos...");
                await actions.getUser(); // Actualizar datos desde el backend
                toast.success(" Usuario actualizado correctamente");

            } else {
                console.error("Falló la actualización del usuario.");
                toast.error("Falló la actualización del usuario.");
            }
        } catch (error) {
            console.error("Error al intentar actualizar usuario:", error);
            toast.error("Error al intentar actualizar usuario:", error);
        }
    };

    return (
        <div className="container w-50 card p-3 mt-4" >
            <h2>Actualizar Usuario</h2>

            <input
                className="form-control my-2"
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <input
                className="form-control my-2"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />

            <input
                className="form-control my-2"
                type="password"
                placeholder="Nueva contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <input
                className="form-control my-2"
                type="text"
                placeholder="+598 xxx xxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <input
                className="form-control my-2"
                type="text"
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <button className="btn btn-primary mt-3" onClick={handleUpdateUser}>
                Actualizar Usuario
            </button>
        </div>
    );
};

export default HandleUpdateUser;