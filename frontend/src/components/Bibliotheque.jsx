import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Bibliotheque.css'; // Fichier CSS pour les styles spécifiques

function Bibliotheque() {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    // Récupérer le thème depuis localStorage
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
    
    const token = localStorage.getItem('token');
    
    // Récupérer les informations de l'utilisateur connecté
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    // Récupérer la liste des livres
    const fetchLivres = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/bibliotheque', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLivres(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        setLoading(false);
      }
    };

    fetchUser();
    fetchLivres();
  }, []);

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Basculer le thème
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`w-full ${darkMode ? 'bg-gray-800 header-shadow-dark' : 'bg-white header-shadow'} p-4 flex justify-between items-center`}>
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BiblioGest</span>
          <nav className="ml-6 space-x-4">
            <Link to="/admin-dashboard" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Accueil</Link>
            <Link to="/users" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Utilisateurs</Link>
            <Link to="/users" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Statistiques</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`relative ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>
            Bonjour, {userName || 'Utilisateur'}
          </div>
          {/* Bouton de thème */}
          <button
            onClick={toggleTheme}
            className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-blue-600'} font-medium transition-colors duration-200 flex items-center gap-1`}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className={`${darkMode ? 'secondary-button-dark' : 'secondary-button'} flex items-center gap-2`}
            aria-label="Déconnexion"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v-7a3 3 0 00-3-3H5"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-start p-6">
        <div className={`${darkMode ? 'bg-gray-800 card-shadow-dark' : 'bg-white card-shadow'} rounded-lg p-6 w-full max-w-6xl`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Liste des livres
            </h1>
            <div className="flex space-x-4">
              {/* Barre de recherche */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`pl-10 pr-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'
                  } border focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-400'
                  }`}
                />
                <svg 
                  className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className={`loader ${darkMode ? 'loader-dark' : 'loader-light'}`}></div>
            </div>
          ) : (
            <div className="overflow-x-auto book-table-container">
              <table className={`min-w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg overflow-hidden book-table`}>
                <thead className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                  <tr>
                    <th className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-3 text-left font-semibold`}>Titre</th>
                    <th className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-3 text-left font-semibold`}>Description</th>
                    <th className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-3 text-left font-semibold`}>Auteur</th>
                  </tr>
                </thead>
                <tbody>
                  {livres.length > 0 ? (
                    livres
                      .filter(livre => 
                        livre.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (livre.description && livre.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (livre.user?.name && livre.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map((livre) => (
                        <tr key={livre.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors book-row`}>
                          <td className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-3`}>{livre.title}</td>
                          <td className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-3`}>{livre.description}</td>
                          <td className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-3`}>{livre.user?.name}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} px-4 py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Aucun livre disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <Link to="/admin-dashboard">
                  <button className={`${darkMode ? 'secondary-button-dark' : 'secondary-button'}`}>
                    Annuler
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`w-full ${darkMode ? 'bg-gray-800 header-shadow-dark' : 'bg-white header-shadow'} p-4 flex justify-between items-center`}>
        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>BiblioGest © 2025</span>
        <div>
          <button className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} mx-2 transition-colors`}>Aide</button>
          <span className={`mx-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
          <button className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} mx-2 transition-colors`}>Paramètres</button>
        </div>
      </footer>
    </div>
  );
}

export default Bibliotheque;