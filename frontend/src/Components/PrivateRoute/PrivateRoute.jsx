// src/Components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom"; 
import { useAuth } from "../../Context"; 

function PrivateRoute() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    // Si no está logueado, lo redirigimos al login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Si está autenticado, permite el acceso a las rutas hijas
}

export default PrivateRoute;
