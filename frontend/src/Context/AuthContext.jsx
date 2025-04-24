import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));

  const isAuth = !!userId;

  const login = (id) => {
    sessionStorage.setItem('userId', id);
    setUserId(id);
  };

  const logout = () => {
    sessionStorage.removeItem('userId');
    setUserId(null);
  };

  useEffect(() => {
    // Esto asegura que el estado siempre esté sincronizado con sessionStorage
    const storedId = sessionStorage.getItem('userId');
    if (storedId && !userId) {
      setUserId(storedId);
    }
  }, []);

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
