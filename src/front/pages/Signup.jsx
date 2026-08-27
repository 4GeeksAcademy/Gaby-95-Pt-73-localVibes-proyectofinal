import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import register from "../../images/register.jpg";
import fondo from "../../images/fondo_completo.jpg";

export const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        lastname: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                alert("Usuario registrado con éxito.");
                navigate("/login");
            } else {
                setError(data.message || "Error al registrar");
            }
        } catch (err) {
            setError("Error de conexión");
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-5">
            
            {/* CAPA 1: Imagen de fondo total (FIXED) */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -2,
                }}
            ></div>

            {/* CAPA 2: Filtro Blur y Degradado total (FIXED) */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)",
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    zIndex: -1,
                }}
            ></div>

            {/* CAPA 3: Contenedor del Formulario (Tarjeta) */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden shadow-2xl" style={{ maxWidth: "1000px", width: "100%", zIndex: 1 }}>
                <div className="row g-0 align-items-stretch">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="col-md-6 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-4 text-center text-md-start">
                            <h2 className="fw-bold mb-1 text-dark">Crear cuenta</h2>
                            <p className="text-muted small">Únete a LocalVibes y descubre lo mejor de tu ciudad.</p>
                        </div>

                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label fw-semibold small">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control form-control-lg bg-light border-0 fs-6"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label fw-semibold small">Apellido</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className="form-control form-control-lg bg-light border-0 fs-6"
                                        placeholder="Tu apellido"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Nombre de usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="usuario_vibes"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-check mb-4 small">
                                <input type="checkbox" className="form-check-input" id="termsCheck" required />
                                <label className="form-check-label text-muted" htmlFor="termsCheck">
                                    Acepto los <a href="#" className="text-decoration-none fw-bold" style={{ color: "#ef4444" }} data-bs-toggle="modal" data-bs-target="#termsModal">Términos y Condiciones</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-lg w-100 text-white rounded-3 mb-4 fs-6 fw-bold shadow-sm"
                                style={{ backgroundColor: "#ef4444", border: "none" }}
                            >
                                Registrarse
                            </button>

                            <div className="text-center">
                                <p className="text-muted small mb-0">
                                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#ef4444", fontWeight: "700", textDecoration: "none" }}>Inicia sesión</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Imagen decorativa */}
                    <div className="col-md-6 d-none d-md-block">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${register})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* MODAL DE TÉRMINOS */}
            <div className="modal fade" id="termsModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-0 bg-light">
                            <h5 className="modal-title fw-bold">Términos y Condiciones</h5>
                            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-muted small px-4">
                            <p className="fw-bold text-dark">Bienvenido a LocalVibes.</p>
                            <p>Al registrarte, aceptas que LocalVibes es una herramienta para descubrir eventos y que no nos hacemos responsables por cambios en la programación de los locales registrados.</p>
                        </div>
                        <div className="modal-footer border-0 p-3">
                            <button type="button" className="btn text-white w-100 fw-bold rounded-3 py-2" style={{ backgroundColor: "#ef4444" }} data-bs-dismiss="modal">
                                Acepto los términos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};