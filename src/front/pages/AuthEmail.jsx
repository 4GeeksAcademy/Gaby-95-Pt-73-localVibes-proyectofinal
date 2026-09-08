import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../../images/login.jpg"; // Puedes cambiar esta imagen por una de correo luego si lo deseas
import fondo from "../../images/fondo_completo.jpg";

export const AuthEmail = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // Asegúrate de cambiar esta ruta por la de tu backend real
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("¡Correo verificado con éxito! Redirigiendo...");
                // Espera 2 segundos antes de enviar al usuario al login
                setTimeout(() => {
                    navigate("/login"); 
                }, 2000);
            } else {
                setError(data.message || "Código inválido o expirado");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
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

            {/* CAPA 3: Tarjeta de Verificación */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "900px", width: "100%", zIndex: 1 }}>
                <div className="row g-0 align-items-stretch">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="col-md-6 p-4 p-sm-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-4">
                            <h3 className="fw-bold mb-2 text-dark">Verifica tu correo</h3>
                            <p className="text-muted small">
                                Hemos enviado un código de seguridad a tu bandeja de entrada. Ingrésalo a continuación para continuar.
                            </p>
                        </div>

                        {/* Alertas de Error o Éxito */}
                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
                        {success && <div className="alert alert-success py-2 small mb-3">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Input Código */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold small text-dark">Código de verificación</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg bg-light border-0 fs-6 shadow-sm text-center fw-bold"
                                    placeholder="Ej: 123456"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength="6" // Opcional: Limita la cantidad de caracteres
                                    required
                                />
                            </div>

                            {/* Botón Principal */}
                            <button
                                type="submit"
                                className="btn btn-lg w-100 text-white rounded-3 mb-4 fs-6 fw-bold shadow-sm"
                                style={{ backgroundColor: "#ef4444", border: "none" }}
                                disabled={!!success} // Deshabilita el botón si ya tuvo éxito
                            >
                                Verificar cuenta
                            </button>

                            {/* Enlaces de pie de formulario */}
                            <div className="text-center mt-3">
                                <p className="text-muted small mb-2">
                                    ¿No recibiste el código? <button type="button" className="btn btn-link p-0 fw-bold text-decoration-none shadow-none" style={{ color: "#ef4444" }}>Reenviar correo</button>
                                </p>
                                <p className="text-muted small mb-0">
                                    <Link to="/login" className="text-decoration-none fw-bold text-secondary">
                                        ← Volver al inicio de sesión
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Imagen secundaria decorativa */}
                    <div className="col-md-6 d-none d-md-block">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${loginImg})`,
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