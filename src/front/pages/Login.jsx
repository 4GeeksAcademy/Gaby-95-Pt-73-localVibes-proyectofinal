import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import login from "../../images/login.jpg"
import fondo from "../../images/fondo_completo.jpg";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/profile");
            } else {
                setError(data.message || "Credenciales inválidas");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        /* Contenedor principal que vive estrictamente en el espacio central entre el Navbar y el Footer */
        <div 
            className="w-100 d-flex align-items-center justify-content-center p-4 my-3 position-relative"
            style={{ 
                minHeight: "75vh", // Asegura altura suficiente en el centro sin pisar los extremos
            }}
        >

            {/* CAPA 1: La imagen de fondo global adaptada al área central */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                style={{
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -2,
                }}
            ></div>

            {/* CAPA 2: El filtro de Blur y el Degradado oscuro */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                style={{
                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: -1,
                }}
            ></div>

            {/* CAPA 3: Contenedor principal estilo tarjeta ancha */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "900px", width: "100%", zIndex: 1 }}>
                <div className="row g-0 align-items-stretch">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="col-md-6 p-4 p-sm-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-4">
                            <h3 className="fw-bold mb-2">Iniciar sesión</h3>
                            <p className="text-muted small">Descubre y conecta con los mejores eventos.</p>
                        </div>

                        {error && <div className="alert alert-danger py-2 small">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Input Correo */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Input Contraseña */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Opciones de cuenta */}
                            <div className="d-flex justify-content-between align-items-center mb-4 small">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input shadow-none" id="rememberMe" />
                                    <label className="form-check-label text-muted" htmlFor="rememberMe">Recuérdame</label>
                                </div>
                                <a href="#" className="text-decoration-none text-muted">¿Olvidaste tu contraseña?</a>
                            </div>

                            {/* Botón Principal */}
                            <button
                                type="submit"
                                className="btn btn-lg w-100 text-white rounded-3 mb-4 fs-6 fw-semibold"
                                style={{ backgroundColor: "#ef4444", border: "none" }}
                            >
                                Iniciar sesión
                            </button>

                            {/* Separador */}
                            <div className="position-relative text-center mb-4">
                                <hr className="text-muted opacity-25" />
                                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small" style={{ fontSize: "0.8rem" }}>
                                    o continúa con
                                </span>
                            </div>

                            {/* Botones Sociales */}
                            <div className="d-flex gap-3 mb-4">
                                <button type="button" className="btn btn-outline-light text-dark border w-50 d-flex align-items-center justify-content-center rounded-3 fs-6">
                                    <i className="bi bi-google me-2"></i> Google
                                </button>
                                <button type="button" className="btn btn-outline-light text-dark border w-50 d-flex align-items-center justify-content-center rounded-3 fs-6">
                                    <i className="bi bi-apple me-2"></i> Apple t
                                </button>
                            </div>

                            {/* Enlace de Registro */}
                            <div className="text-center mt-3">
                                <p className="text-muted small mb-0">
                                    ¿No tienes cuenta? <Link to="/signup" style={{ color: "#ef4444", fontWeight: "600", textDecoration: "none" }}>Regístrate</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Imagen secundaria o decorativa de la tarjeta */}
                    <div className="col-md-6 d-none d-md-block">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${login})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                minHeight: "100%"
                            }}
                        >
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};