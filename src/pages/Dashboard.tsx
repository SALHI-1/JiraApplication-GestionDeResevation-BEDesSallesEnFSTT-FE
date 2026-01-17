
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const auth = useContext(AuthContext);

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <header className="card bg-white border-l-4 border-primary-500">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
                            Tableau de Bord
                        </h1>
                        <p className="mt-2 text-secondary-600">
                            Bienvenue dans votre espace, <span className="font-semibold text-primary-700">{auth?.user?.nom}</span>.
                        </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary-100 text-secondary-700 uppercase tracking-wide">
                        {auth?.user?.role}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link to="/rooms" className="block group">
                    <div className="card h-full transition-all duration-200 hover:shadow-md hover:border-primary-300 group-hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">Voir les Salles</h5>
                            <svg className="w-6 h-6 text-primary-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <p className="text-secondary-600">Consultez la liste des salles disponibles, leurs capacités et équipements pour vos cours.</p>
                    </div>
                </Link>

                <Link to="/reservations" className="block group">
                    <div className="card h-full transition-all duration-200 hover:shadow-md hover:border-primary-300 group-hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">Mes Réservations</h5>
                            <svg className="w-6 h-6 text-primary-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-secondary-600">Gérez vos réservations de salles, créez-en de nouvelles et consultez votre historique.</p>
                    </div>
                </Link>

                {auth?.user?.role === 'Administrateur' && (
                    <Link to="/users" className="block group">
                    <div className="card h-full border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xl font-bold text-secondary-900">Administration</h5>
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-secondary-600">Accédez au panneau d'administration pour gérer les utilisateurs.</p>
                    </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
