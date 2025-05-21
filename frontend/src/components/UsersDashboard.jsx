import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UsersDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetch logged-in user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
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

    // Récupérer le thème depuis localStorage ou utiliser le thème par défaut
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');

    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Toggle theme
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
            <Link to="/user-dashboard" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Accueil</Link>
            <Link to="/books" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Livres</Link>
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
          {/* Bouton de déconnexion amélioré */}
          <button
            onClick={handleLogout}
            className={`${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2`}
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
          <h1 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>BiblioGest</h1>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-8`}>Plateforme de gestion de bibliothèque simple et efficace</p>

          {/* Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-6 text-center`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Gestion des livres</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 font-medium`}>Ajoutez, modifiez et visualisez votre collection de livres</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
                Gérez facilement votre inventaire de livres avec des fonctionnalités complètes pour ajouter de nouveaux titres, modifier les informations existantes et suivre les emprunts.
              </p>
              <Link to="/books">
                <button className={`mt-6 ${darkMode ? 'main-button-dark' : 'main-button'}`}>Voir ma bibliothèque</button>
              </Link>
            </div>

            <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-6 text-center`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Profil utilisateur</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 font-medium`}>Accédez à votre profil et vos préférences</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
                Accédez à vos informations personnelles, modifiez vos paramètres et consultez votre historique d'activité sur la plateforme.
              </p>
            <Link to={`/profile`}>
              <button className={`mt-6 ${darkMode ? 'secondary-button-dark' : 'secondary-button'}`}>
                Voir le profil
              </button>
            </Link>           
             </div>

            <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-6 text-center`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Paramètres</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 font-medium`}>Configurez la plateforme selon vos besoins</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
                Personnalisez les paramètres de la bibliothèque, gérez les utilisateurs et configurez les options de notification.
              </p>
              <button className={`mt-6 ${darkMode ? 'secondary-button-dark' : 'secondary-button'}`}>Paramètres</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/add-book">
              <button className={`${darkMode ? 'action-button-dark' : 'action-button'}`}>
                <span className="button-icon mr-2">+</span>
                Ajouter un livre
              </button>
            </Link>
            <Link to="/books">
              <button className={`${darkMode ? 'action-button-dark' : 'action-button'}`}>
                <span className="button-icon mr-2">|||</span>
                Voir tous les livres
              </button>
            </Link>
          </div>
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

export default UsersDashboard;