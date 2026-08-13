import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Sesión expirada");
            return res.json();
        })
        .then(data => setUser(data))
        .catch(err => {
            setError(err.message);
            localStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="text-center mb-4">Perfil de Usuario</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {user ? (
                <div className="card p-4 shadow-sm text-center">
                    <h4>Bienvenido, {user.name} {user.lastname} 👋</h4>
                    <p className="text-muted">@{user.username}</p>
                    <hr />
                    <p className="mb-1"><strong>ID:</strong> {user.id}</p>
                    <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-1"><strong>Rol:</strong> {user.role}</p>
                    <p className="mb-1">
                        <strong>Verificado:</strong> {user.email_verify ? "Sí" : "No"}
                    </p>
                    <button onClick={handleLogout} className="btn btn-danger mt-4 w-100">
                        Cerrar Sesión
                    </button>
                </div>
            ) : (
                <p className="text-center">Cargando perfil...</p>
            )}
        </div>
    );
};