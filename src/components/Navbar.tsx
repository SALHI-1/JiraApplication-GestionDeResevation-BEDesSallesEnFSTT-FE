
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const auth = useContext(AuthContext);

    return (
        <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-primary-600 tracking-tight">
                            FSTT Reservations
                        </Link>
                        {auth?.user && (
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link to="/dashboard" className="border-transparent text-secondary-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200">
                                    Tableau de bord
                                </Link>
                                <Link to="/rooms" className="border-transparent text-secondary-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200">
                                    Salles
                                </Link>
                                <Link to="/reservations" className="border-transparent text-secondary-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200">
                                    Réservations
                                </Link>
                                {auth?.user?.role === 'Administrateur' && (
                                    <Link to="/users" className="border-transparent text-secondary-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200">
                                        Utilisateurs
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {auth?.user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-secondary-900">{auth.user.nom}</span>
                                    <span className="text-xs text-secondary-500">{auth.user.role || 'Utilisateur'}</span>
                                </div>
                                <button
                                    onClick={auth.logout}
                                    className="text-sm text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Connexion
                                </Link>
                                <Link to="/register" className="btn-primary text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all">
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
