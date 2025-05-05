import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context";

function PrivateRoute() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuth) {
      navigate('/home', {
        replace: true,
        state: {
          needsAuthAlert: true,
          from: location.pathname 
        }
      });
    }
  }, [isAuth, navigate, location]);

  return isAuth ? <Outlet /> : null;
}

export default PrivateRoute;