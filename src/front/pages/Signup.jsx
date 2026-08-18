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
                alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                setError(data.message || "Error al registrar el usuario");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
            {/* Contenedor principal estilo tarjeta ancha */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "900px", width: "100%" }}>
                <div className="row g-0 align-items-stretch">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="col-md-6 p-4 p-sm-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-4">
                            <h3 className="fw-bold mb-2">Crear cuenta</h3>
                            <p className="text-muted small">Únete a LocalVibes y descubre los mejores eventos de la ciudad.</p>
                        </div>

                        {error && <div className="alert alert-danger py-2 small">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Fila para Nombre y Apellido */}
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label fw-semibold small text-dark">Nombre</label>
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
                                    <label className="form-label fw-semibold small text-dark">Apellido</label>
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

                            {/* Input Username */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Nombre de usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="ej. usuario123"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Input Correo */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Input Contraseña */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold small text-dark">Contraseña</label>
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

                            {/* Checkbox de términos */}
                            <div className="form-check mb-4 small">
                                <input type="checkbox" className="form-check-input shadow-none" id="terms" required />
                                <label className="form-check-label text-muted" htmlFor="terms">
                                    Acepto los <a href="#" className="text-decoration-none" style={{ color: "#ef4444" }} data-bs-toggle="modal" data-bs-target="#termsModal">
                                        Términos y Condiciones
                                    </a>
                                </label>
                            </div>

                            {/* Botón Principal */}
                            <button
                                type="submit"
                                className="btn btn-lg w-100 text-white rounded-3 mb-3 fs-6 fw-semibold"
                                style={{ backgroundColor: "#ef4444", border: "none" }}
                            >
                                Registrarse
                            </button>

                            {/* Enlace de Login */}
                            <div className="text-center mt-2">
                                <p className="text-muted small mb-0">
                                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#ef4444", fontWeight: "600", textDecoration: "none" }}>Inicia sesión aquí</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Imagen de Fondo */}
                    <div className="col-md-6 d-none d-md-block">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${register})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                minHeight: "100%"
                            }}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE TÉRMINOS Y CONDICIONES */}
            <div className="modal fade" id="termsModal" tabIndex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header bg-light border-0">
                            <h5 className="modal-title fw-bold" id="termsModalLabel">Términos y Condiciones de LocalVibes</h5>
                            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-muted small">
                            <h6 className="text-dark fw-semibold">1. Propósito de la Plataforma</h6>
                            <p>LocalVibes es una plataforma diseñada para conectar a los usuarios con la cultura, entretenimiento y vida nocturna local. Facilitamos el descubrimiento de eventos, conciertos y locales en la ciudad.</p>

                            <h6 className="text-dark fw-semibold mt-3">2. Uso de Mapas y Ubicación</h6>
                            <p>Para mejorar la experiencia de descubrimiento, LocalVibes utiliza integraciones de terceros como OpenStreetMap. Al hacer uso de nuestras funciones de geolocalización o visualizar mapas, aceptas las políticas de uso de dichos proveedores.</p>

                            <h6 className="text-dark fw-semibold mt-3">3. Responsabilidad sobre los Eventos</h6>
                            <p>LocalVibes actúa únicamente como un directorio o cartelera informativa. No somos los organizadores directos de los eventos promocionados en la plataforma. Por lo tanto, no nos hacemos responsables por cancelaciones, cambios de horario, modificaciones en los precios de las entradas o problemas de acceso a los locales.</p>

                            <h6 className="text-dark fw-semibold mt-3">4. Conducta del Usuario</h6>
                            <p>Al crear una cuenta, te comprometes a proporcionar información veraz. Nos reservamos el derecho de suspender cuentas que utilicen la plataforma para generar spam, dejar reseñas falsas sobre locales o vulnerar la seguridad de nuestra API.</p>
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: "#ef4444" }} data-bs-dismiss="modal">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};