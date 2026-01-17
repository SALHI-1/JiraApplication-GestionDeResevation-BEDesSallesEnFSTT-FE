
import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

interface User {
    _id: string;
    nom: string;
    email: string;
    role: string;
}

const Users = () => {
    const { user: currentUser } = useContext(AuthContext)!;
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    // Form state
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Enseignant');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/users');
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update
                const { data } = await API.put(`/users/${editingId}`, { nom, email, role });
                setUsers(users.map(u => u._id === editingId ? { ...u, ...data } : u));
                setMsg('Utilisateur mis à jour avec succès');
                setEditingId(null);
            } else {
                // Create
                const { data } = await API.post('/users/create', { nom, email, mot_de_passe: password, role });
                setUsers([...users, data]);
                setMsg('Utilisateur créé avec succès');
            }
            // Reset form
            setNom('');
            setEmail('');
            setPassword('');
            setRole('Enseignant');
        } catch (error: any) {
            console.error(error);
            setMsg(error.response?.data?.message || 'Une erreur est survenue');
        }
    };

    const handleEdit = (user: User) => {
        setEditingId(user._id);
        setNom(user.nom);
        setEmail(user.email);
        setRole(user.role);
        setMsg('');
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await API.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            setMsg('Utilisateur supprimé');
        } catch (error: any) {
            console.error(error);
            setMsg(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNom('');
        setEmail('');
        setPassword('');
        setRole('Enseignant');
        setMsg('');
    }

    if (currentUser?.role !== 'Administrateur') {
        return <div className="p-8 text-center text-red-600">Accès interdit</div>;
    }

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-secondary-900 tracking-tight px-4 sm:px-0">
                Gestion des Utilisateurs
            </h1>

            {/* Create/Edit Form */}
            <div className="card border-primary-100">
                <div className="border-b border-secondary-200 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-secondary-900">
                        {editingId ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                    </h2>
                </div>

                {msg && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center ${msg.includes('succès') || msg.includes('supprimé') ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 items-end">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-secondary-700">Nom</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-secondary-700">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {!editingId && (
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-secondary-700">Mot de passe</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-secondary-700">Rôle</label>
                        <select
                            className="input-field"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Enseignant">Enseignant</option>
                            <option value="Administrateur">Administrateur</option>
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <button type="submit" className="flex-1 btn-primary h-[42px] flex items-center justify-center">
                            {editingId ? 'Modifier' : 'Créer'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Users */}
            <div className="card overflow-hidden p-0">
                <div className="px-6 py-4 border-b border-secondary-200 bg-secondary-50">
                    <h3 className="text-lg font-medium text-secondary-900">Liste des utilisateurs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-secondary-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{u.nom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'Administrateur' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-secondary-500">Aucun utilisateur trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
