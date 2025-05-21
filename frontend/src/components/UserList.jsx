import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false); // Add dark mode support
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to get the message from state

  useEffect(() => {
    // Check for a message in the navigation state (from UserUpdate redirect)
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType(location.state.message.includes('Erreur') ? 'error' : 'success');
      clearMessage(); // Clear the message after 3 seconds (already defined)
    }

    fetchUsers();
    fetchUser();
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, [location]); // Add location as a dependency to re-run when the route changes

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get('http://127.0.0.1:8000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      setMessage('Veuillez vous reconnecter.');
      setMessageType('error');
      navigate('/login');
      clearMessage();
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter users with role 'user'
      const filteredUsers = response.data.filter(user => user.role === 'user');
      setUsers(filteredUsers);
    } catch (error) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      };
      console.error('Erreur lors de la récupération des utilisateurs:', errorDetails);
      setMessage('Erreur lors de la récupération des utilisateurs.');
      setMessageType('error');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      clearMessage();
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users-destroy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      setMessage('Utilisateur supprimé avec succès !');
      setMessageType('success');
    } catch (error) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      };
      console.error('Erreur lors de la suppression de l\'utilisateur :', errorDetails);
      setMessage('Erreur lors de la suppression de l’utilisateur.');
      setMessageType('error');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
    clearMessage();
  };

  const confirmDeleteUser = (id) => {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (isConfirmed) {
      handleDeleteUser(id);
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
            <Link to="/statistiques" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Statistiques</Link>
            
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`relative ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>
            Bonjour, {userName || 'Utilisateur'}
          </div>
          {/* Theme Toggle Button */}
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
          {/* Logout Button */}
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
        <div className={`${darkMode ? 'bg-gray-800 card-shadow-dark' : 'bg-white card-shadow'} rounded-lg p-6 w-full max-w-6xl user-list-container`}>
          <div className="page-header">
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>Liste des Utilisateurs</h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Gérez les utilisateurs de la plateforme</p>
          </div>
          
          {message && (
            <div className={`message ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-between mb-4">
            <Link to="/add-user">
              <button className="add-button">
                Ajouter un nouvel utilisateur
              </button>
            </Link>
          </div>

          {users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td className="action-buttons">
                      {/* Voir les détails d'un utilisateur */}
                      <Link to={`/users-show/${user.id}`}>
                        <button className="view-button">Voir</button>
                      </Link>

                      {/* Modifier un utilisateur */}
                      <Link to={`/users-update/${user.id}`}>
                        <button className="edit-button">Modifier</button>
                      </Link>

                      {/* Supprimer un utilisateur avec confirmation */}
                      <button
                        className="delete-button"
                        onClick={() => confirmDeleteUser(user.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={`text-center p-10 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              <p className="mb-4">Aucun utilisateur trouvé.</p>
            </div>
          )}

          <div className="mt-4">
            <Link to="/admin-dashboard">
              <button className="back-button">
                Retour
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
};

export default UserList;