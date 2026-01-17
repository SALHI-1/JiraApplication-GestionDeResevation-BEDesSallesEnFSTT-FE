
import { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

interface Salle {
    _id: string;
    nom_identifiant: string;
    capacite: number;
    localisation: string;
    type: string;
    etat: string;
}

const Rooms = () => {
    const { user } = useContext(AuthContext)!;
    const [salles, setSalles] = useState<Salle[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
    const [formData, setFormData] = useState({
        nom_identifiant: '',
        capacite: 0,
        localisation: '',
        type: '',
        etat: ''
    });

    useEffect(() => {
        const fetchSalles = async () => {
            try {
                const { data } = await API.get('/salles');
                setSalles(data);
            } catch (error) {
                console.error("Erreur lors du chargement des salles", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalles();
    }, []);

    const handleEditClick = (salle: Salle) => {
        setEditingSalle(salle);
        setFormData({
            nom_identifiant: salle.nom_identifiant,
            capacite: salle.capacite,
            localisation: salle.localisation,
            type: salle.type,
            etat: salle.etat
        });
        setIsModalOpen(true);
    };

    const handleUpdateSalle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSalle) return;

        try {
            const dataToSend = {
                ...formData,
                capacite: Number(formData.capacite) // Force la conversion
            };
            const { data } = await API.put(`/salles/${editingSalle._id}`, dataToSend);
            setSalles(salles.map(s => s._id === data._id ? data : s));
            setIsModalOpen(false);
            setEditingSalle(null);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la mise à jour');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-0">
                <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Liste des Salles</h1>
                <p className="mt-2 md:mt-0 text-secondary-500 text-sm">
                    {salles.length} salle{salles.length > 1 ? 's' : ''} répertoriée{salles.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
                {salles.map((salle) => (
                    <div key={salle._id} className="card hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary-500 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-secondary-900">{salle.nom_identifiant}</h3>
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${salle.etat === 'Disponible'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {salle.etat}
                                </span>
                            </div>
                            <div className="space-y-3 text-secondary-600 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{salle.type}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{salle.capacite} personnes</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{salle.localisation}</span>
                                </div>
                            </div>
                        </div>
                        {user?.role === 'Administrateur' && (
                            <div className="mt-4 pt-4 border-t border-secondary-100">
                                <button
                                    onClick={() => handleEditClick(salle)}
                                    className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Modifier
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {salles.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg border-2 border-dashed border-secondary-300 mx-4 sm:mx-0">
                    <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucune salle</h3>
                    <p className="mt-1 text-sm text-secondary-500">Aucune salle n'a été trouvée dans le système.</p>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 text-secondary-900">Modifier la salle</h2>
                        <form onSubmit={handleUpdateSalle} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Nom</label>
                                <input
                                    type="text"
                                    className="input-field mt-1"
                                    value={formData.nom_identifiant}
                                    onChange={(e) => setFormData({ ...formData, nom_identifiant: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Capacité</label>
                                    <input
                                        type="number"
                                        className="input-field mt-1"
                                        value={formData.capacite}
                                        onChange={(e) => setFormData({ ...formData, capacite: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Type</label>
                                    <input
                                        type="text"
                                        className="input-field mt-1"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Localisation</label>
                                <input
                                    type="text"
                                    className="input-field mt-1"
                                    value={formData.localisation}
                                    onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">État</label>
                                <select
                                    className="input-field mt-1"
                                    value={formData.etat}
                                    onChange={(e) => setFormData({ ...formData, etat: e.target.value })}
                                >
                                    <option value="Disponible">Disponible</option>
                                    <option value="Occupé">Occupé</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
