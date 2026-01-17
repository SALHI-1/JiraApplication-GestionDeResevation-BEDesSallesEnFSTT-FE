import { createContext, useState, useEffect, type ReactNode } from 'react';
import API from '../api/axios';

interface User {
    _id: string;
    nom: string;
    email: string;
    role: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, mot_de_passe: string) => Promise<void>;
    register: (nom: string, email: string, mot_de_passe: string, role?: string) => Promise<void>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // MODIFICATION : Initialisé à 'true' pour bloquer les redirections au démarrage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Optionnel : Configurer le header Authorization d'API ici si nécessaire
                    // API.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
                }
            } catch (error) {
                console.error("Erreur de lecture du localStorage", error);
                localStorage.removeItem('user');
            } finally {
                // On a fini de vérifier le localStorage, on libère l'application
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email: string, mot_de_passe: string) => {
        setLoading(true);
        try {
            const { data } = await API.post('/users/login', { email, mot_de_passe });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (nom: string, email: string, mot_de_passe: string, role: string = 'Enseignant') => {
        setLoading(true);
        try {
            const { data } = await API.post('/users', { nom, email, mot_de_passe, role });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {/* On ne rend les enfants que lorsque le chargement initial est terminé */}
            {!loading ? children : (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};