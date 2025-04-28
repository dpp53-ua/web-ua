import { createContext, useContext, useState, useEffect } from 'react';
import { applyUserPreferences } from '../Utils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));

  const isAuth = !!userId;

  const login = async (id) => {
    sessionStorage.setItem('userId', id);
    setUserId(id);
  
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`);
      if (!res.ok) throw new Error();
      const user = await res.json();
      applyUserPreferences({ theme: user.theme, fontSize: user.fontSize });
      localStorage.setItem(
        'userPreferences',
        JSON.stringify({ theme: user.theme, fontSize: user.fontSize })
      );
    } catch (err) {
      console.error("No se pudieron aplicar preferencias tras login:", err);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('userId');
    setUserId(null);
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
    }
  
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
      const parsedPrefs = JSON.parse(storedPrefs);
      applyUserPreferences(parsedPrefs);
    }

  }, [userId]);  // Solo se ejecuta cuando userId cambia

  return (
    <AuthContext.Provider value={{ userId, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}
