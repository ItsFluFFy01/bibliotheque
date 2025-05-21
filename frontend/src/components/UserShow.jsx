import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link import
import axios from 'axios';
import './UserShow.css';

function UserShow() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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
        const response = await axios.get(`http://127.0.0.1:8000/api/users-show/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else if (error.response && error.response.status === 404) {
          navigate('/not-found');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col min-h-screen justify-center items-center ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex justify-between items-center shadow`}>
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BiblioGest</span>
          <nav className="ml-6 space-x-4">
            <a href="/admin-dashboard" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}>Accueil</a>
            <a href="/bibliotheque" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}>Livres</a>
            <a href="/" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}>Statistiques</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>
            Bonjour, {user?.name || 'Utilisateur'}
          </div>
          <button
            onClick={toggleTheme}
            className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-blue-600'} transition-colors flex items-center gap-1`}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded flex items-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v-7a3 3 0 00-3-3H5" />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-start p-6">
        <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg p-6 w-full max-w-4xl shadow-lg`}>
          <h1 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Profil Utilisateur
          </h1>

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Profile Avatar Section */}
              <div className="flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 ${darkMode ? 'bg-blue-700' : 'bg-blue-500'}`}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
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
              <div className="col-span-3">
                <div className={`mb-8 p-4 rounded-lg w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nom complet</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.email}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rôle</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.role}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Âge</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.age ?? 'Non défini'}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.phone ?? 'Non défini'}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adresse</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.address ?? 'Non défini'}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date d'inscription</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(user.created_at)}</p>
                    </div>
                    <div className="p-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dernière mise à jour</p>
                      <p className={`font-medium break-words ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="flex justify-center mt-8 space-x-4">
         
          <a href="/users">
            <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded flex items-center gap-2`}>
             
              Retour 
            </button>
          </a>
        </div>
      </div>
    </main>

    {/* Footer */}
    <footer className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex justify-between items-center shadow`}>
      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>BiblioGest © 2025</span>
      <div>
        <button className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} mx-2`}>Aide</button>
        <span className={`mx-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
        <button className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} mx-2`}>Paramètres</button>
      </div>
    </footer>
  </div>
);
}
export default UserShow;