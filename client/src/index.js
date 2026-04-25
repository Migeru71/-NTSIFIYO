import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importante para que Tailwind funcione
import App from './App'; // Llama al componente principal

import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { GameProvider } from './context/GameContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryClient global de TanStack Query.
 * - staleTime: Infinity  → los datos nunca se consideran "viejos" automáticamente;
 *   solo se refrescan cuando el usuario pulsa "Actualizar" (invalidateQueries).
 * - gcTime: 15 min      → los datos sin suscriptores se eliminan de la caché
 *   después de 15 minutos de inactividad.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            gcTime: 1000 * 60 * 15,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Crea la raíz del sitio vinculándola al div 'root' del index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación dentro del modo estricto de React
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AlertProvider>
                    <GameProvider>
                        <App />
                    </GameProvider>
                </AlertProvider>
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);