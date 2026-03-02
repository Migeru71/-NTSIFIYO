import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Inicializamos el estado intentando leer del localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('appUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('authToken'));

    // Función para iniciar sesión
    const login = (userData, userToken) => {
        // 1. Guardar en el estado de React (para la UI)
        setUser(userData);
        setToken(userToken);

        // 2. Persistir en el navegador (para F5)
        localStorage.setItem('appUser', JSON.stringify(userData));
        localStorage.setItem('authToken', userToken);
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('appUser');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
