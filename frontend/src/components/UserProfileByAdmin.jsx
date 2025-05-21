import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfileByAdmin() {
  const { id } = useParams(); // ID passé via l'URL
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Erreur de récupération du profil :', err);
        navigate('/admin-dashboard'); // ou une autre redirection
      });
  }, [id, navigate]);

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Profil de {user.name}</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
      {/* Ajoute ici ce que tu veux afficher */}
      <button onClick={() => navigate(-1)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Retour</button>
    </div>
  );
}

export default UserProfileByAdmin;
