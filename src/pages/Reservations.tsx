
import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

interface Reservation {
    _id: string;
    id_salle: { nom_identifiant: string };
    id_creneau: { heure_debut: string; heure_fin: string; jour_semaine: string };
    date_reservation: string;
    statut: string;
    id_utilisateur: { nom: string } | null;
}

interface Salle {
    _id: string;
    nom_identifiant: string;
    etat: string;
}

interface Creneau {
    _id: string;
    heure_debut: string;
    heure_fin: string;
    jour_semaine: string;
}
// Pour convertir le numéro du jour JS (0-6) en nom de jour correspondant à votre BDD
const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Date d'aujourd'hui au format YYYY-MM-DD pour l'attribut "min"
const today = new Date().toISOString().split('T')[0];

const Reservations = () => {
    const { user } = useContext(AuthContext)!;
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [salles, setSalles] = useState<Salle[]>([]);
    const [creneaux, setCreneaux] = useState<Creneau[]>([]);

    // Form state
    const [selectedSalle, setSelectedSalle] = useState('');
    const [selectedCreneau, setSelectedCreneau] = useState('');
    const [dateReservation, setDateReservation] = useState('');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resSalles, resCreneaux, resReservations] = await Promise.all([
                API.get('/salles'),
                API.get('/creneaux'),
                API.get('/reservations',
                    //user 
                    {
                        headers: {
                            'role': user?.role,
                            '_id': user?._id
                        }
                    }
                )
            ]);
            setSalles(resSalles.data);
            setCreneaux(resCreneaux.data);
            setReservations(resReservations.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Données envoyées :", {
                id_salle: selectedSalle,
                // id_utilisateur: user?._id,
                id_creneau: selectedCreneau,
                date_reservation: dateReservation,
                user: user
            });
            await API.post('/reservations', {
                id_salle: selectedSalle,
                id_utilisateur: user?._id,
                id_creneau: selectedCreneau,
                date_reservation: dateReservation,
                user: user
            });
            setMsg('Réservation créée avec succès !');
            fetchData(); // Refresh list
            // Reset form
            setSelectedSalle('');
            setSelectedCreneau('');
            setDateReservation('');
        } catch (error: any) {
            console.error(error);
            setMsg(error.response?.data?.message || 'Erreur lors de la réservation.');
        }
    };

    // const handleAction = async (id: string, newStatus: string) => {
    //     if (!window.confirm(`Voulez-vous vraiment ${newStatus === 'Annulée' ? 'annuler' : newStatus === 'Validée' ? 'valider' : 'refuser'} cette réservation ?`)) return;
    //     try {
    //         await API.put(`/reservations/${id}`, { statut: newStatus });
    //         setReservations(reservations.map(r => r._id === id ? { ...r, statut: newStatus } : r));
    //     } catch (error: any) {
    //         console.error(error);
    //         setMsg(error.response?.data?.message || 'Erreur lors de la mise à jour.');
    //     }
    // }

    const handleAction = async (id: string, newStatus: string) => {
        if (!window.confirm(`Voulez-vous vraiment passer le statut à ${newStatus} ?`)) return;

        try {
            // Envoi des infos manuellement dans le body
            const response = await API.put(`/reservations/${id}`, {
                statut: newStatus,
                userId: user?._id, // Indispensable sans middleware
                role: user?.role   // Indispensable sans middleware
            });

            // Mise à jour de la liste locale
            setReservations(prev => prev.map(r =>
                r._id === id ? { ...r, statut: response.data.statut } : r
            ));

            setMsg(`Action effectuée : ${newStatus}`);
        } catch (error: any) {
            console.error(error);
            setMsg(error.response?.data?.message || 'Erreur lors de la mise à jour.');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-secondary-900 tracking-tight px-4 sm:px-0">
                {user?.role === 'Administrateur' ? 'Gestion des Réservations' : 'Mes Réservations'}
            </h1>


            {/* Create Reservation Form */}
            {/* On utilise les accolades pour injecter du JS dans le JSX */}
            {user?.role !== 'Administrateur' && (
                <div className="card border-primary-100">
                    <div className="border-b border-secondary-200 pb-4 mb-6">
                        <h2 className="text-lg font-bold text-secondary-900">Nouvelle Réservation</h2>
                        <p className="text-sm text-secondary-500">Remplissez le formulaire pour réserver une salle.</p>
                    </div>

                    {msg && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center ${msg.includes('succès') ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                            {msg}
                        </div>
                    )}

                    <form onSubmit={handleCreateReservation} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-end">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-secondary-700">Salle</label>
                            <select
                                required
                                className="input-field"
                                value={selectedSalle}
                                onChange={(e) => setSelectedSalle(e.target.value)}
                            >
                                <option value="">Choisir une salle</option>
                                {salles
                                    .filter(s => s.etat === 'Disponible')
                                    .map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.nom_identifiant}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-secondary-700">Date</label>
                            <input
                                type="date"
                                required
                                min={today} // Empêche de choisir une date passée
                                className="input-field"
                                value={dateReservation}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value);
                                    const dayIndex = selectedDate.getDay(); // 0 = Dimanche, 6 = Samedi

                                    // Vérification Samedi (6) et Dimanche (0)
                                    if (dayIndex === 0 || dayIndex === 6) {
                                        alert("Les réservations ne sont pas autorisées le week-end.");
                                        setDateReservation(''); // Réinitialise l'input
                                    } else {
                                        setDateReservation(e.target.value);
                                        setSelectedCreneau(''); // Réinitialise le créneau si la date change
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-secondary-700">Créneau</label>
                            <select
                                required
                                disabled={!dateReservation} // Désactive tant qu'aucune date n'est choisie
                                className="input-field"
                                value={selectedCreneau}
                                onChange={(e) => setSelectedCreneau(e.target.value)}
                            >
                                <option value="">
                                    {!dateReservation ? "Sélectionnez d'abord une date" : "Choisir un créneau"}
                                </option>

                                {creneaux
                                    .filter(c => {
                                        if (!dateReservation) return false;
                                        const dayName = joursSemaine[new Date(dateReservation).getDay()];
                                        return c.jour_semaine === dayName;
                                    })
                                    .map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.heure_debut} - {c.heure_fin}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <button type="submit" className="w-full btn-primary h-[42px] flex items-center justify-center">
                                Réserver
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Reservations */}
            <div className="card overflow-hidden p-0">
                <div className="px-6 py-4 border-b border-secondary-200 bg-secondary-50">
                    <h3 className="text-lg font-medium text-secondary-900">Historique des réservations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Salle</th>

                                {/* Colonne conditionnelle pour l'Admin */}
                                {user?.role === 'Administrateur' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Utilisateur</th>
                                )}

                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date & Heure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                            {reservations.length > 0 ? (
                                reservations.map((res) => (
                                    <tr key={res._id} className="hover:bg-secondary-50 transition-colors">
                                        {/* Colonne Salle */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                            {res.id_salle?.nom_identifiant}
                                        </td>

                                        {/* Donnée conditionnelle : Nom de l'utilisateur pour l'Admin */}
                                        {user?.role === 'Administrateur' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 font-semibold">
                                                {res.id_utilisateur?.nom || "Utilisateur inconnu"}
                                            </td>
                                        )}

                                        {/* Colonne Date & Heure */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                            {new Date(res.date_reservation).toLocaleDateString()} <span className="text-secondary-300">|</span> {res.id_creneau?.heure_debut}
                                        </td>

                                        {/* Colonne Statut */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${res.statut === 'Validée' ? 'bg-green-100 text-green-800' :
                                                res.statut === 'Refusée' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {res.statut}
                                            </span>
                                        </td>

                                        {/* Colonne Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {user?.role === 'Administrateur' ? (
                                                <>
                                                    {res.statut === 'En attente' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(res._id, 'Validée')}
                                                                className="text-green-600 hover:text-green-900 hover:bg-green-50 px-3 py-1 rounded-md transition-colors"
                                                            >
                                                                Accepter
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(res._id, 'Refusée')}
                                                                className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                                                            >
                                                                Refuser
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {res.statut === 'En attente' && (
                                                        <button
                                                            onClick={() => handleAction(res._id, 'Annulée')}
                                                            className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 px-3 py-1 rounded-md transition-colors"
                                                        >
                                                            Annuler
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user?.role === 'Administrateur' ? 5 : 4} className="px-6 py-10 text-center text-secondary-500 text-sm">
                                        Aucune réservation trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
