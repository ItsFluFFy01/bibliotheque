import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le thème depuis localStorage
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');

    const fetchUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur :", error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col min-h-screen justify-center items-center ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 loading-pulse"></div>
        <p className="mt-4 text-lg loading-pulse">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`w-full ${darkMode ? 'bg-gray-800 header-shadow-dark' : 'bg-white header-shadow'} p-4 flex justify-between items-center`}>
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BiblioGest</span>
          <nav className="ml-6 space-x-4">
            <a href="/user-dashboard" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Accueil</a>
            <a href="/books" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Livres</a>
            <a href="/profile" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors`}>Profil</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`relative ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>
            Bonjour, {user?.name || 'Utilisateur'}
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
      <main className="flex-grow flex justify-center items-start p-6 page-transition-enter-active">
        <div className={`${darkMode ? 'bg-gray-800 card-shadow-dark' : 'bg-white card-shadow'} rounded-lg p-6 w-full max-w-4xl profile-card`}>
          <h1 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="relative inline-block">
              Profil Utilisateur
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-100"></span>
            </span>
          </h1>
          
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Avatar Section */}
              <div className="flex flex-col items-center justify-start">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 ${darkMode ? 'profile-avatar-dark' : 'profile-avatar'}`}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Membre depuis {formatDate(user.created_at)}</p>
                
                <div className={`mt-6 p-3 rounded-lg w-full text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Statut du compte</div>
                  <div className="flex items-center justify-center mt-2">
                    <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                    <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>Actif</span>
                  </div>
                </div>
              </div>
              
              {/* User Information */}
              <div className="col-span-2">
                <div className={`mb-8 ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b pb-6 rounded-lg info-section ${darkMode ? 'dark' : ''}`}>
                  <h3 className={`text-lg font-semibold mb-4 px-4 pt-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                    <div className="info-row p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nom complet</p>
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</p>
                    </div>
                    <div className="info-row p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.email}</p>
                    </div>
                    {user.phone && (
                      <div className="info-row p-2">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.phone}</p>
                      </div>
                    )}
                    {user.role && (
                      <div className="info-row p-2">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rôle</p>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.role}</p>
                      </div>
                    )}
                    <div className="info-row p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date d'inscription</p>
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(user.created_at)}</p>
                    </div>
                    <div className="info-row p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dernière mise à jour</p>
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Statistiques */}
               
                </div>
              </div>
          )}
          
          <div className="flex justify-center mt-8">
            <a href="/user-dashboard">
              <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2 back-button`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Retour au tableau de bord</span>
              </button>
            </a>
          </div>
          
          {/* Quick Links */}
          <div className="flex justify-center gap-4 mt-6">
            <a href="/books" className={`py-2 px-4 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
              Parcourir les livres
            </a>
            <a href="#" className={`py-2 px-4 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
              Aide et support
            </a>
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

export default UserProfile;