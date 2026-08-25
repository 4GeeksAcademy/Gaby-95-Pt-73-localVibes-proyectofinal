import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { Events } from "./pages/Events"; // 1. IMPORTAMOS LA PÁGINA DE EVENTOS

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Not found!</h1>}
        >

            {/* Página principal de Local Vibes */}
            <Route index element={<Home />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Rutas Principales */}
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} /> {/* 2. REGISTRAMOS LA RUTA /events */}
            
        </Route>
    )
);