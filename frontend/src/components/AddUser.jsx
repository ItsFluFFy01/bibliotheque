import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AddUser.css';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user', // Default to "user"
    age: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(''); // Track user role
  const [darkMode, setDarkMode] = useState(false); // Add dark mode support
  const navigate = useNavigate();

  // Fetch logged-in user information and theme
  useEffect(() => {
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
        setUserRole(response.data.role); // Set user role
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setMessage('Veuillez vous reconnecter.');
        setMessageType('error');
        navigate('/login');
      }
    };

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify password confirmation
    if (formData.password !== formData.password_confirmation) {
      setMessage('Les mots de passe ne correspondent pas.');
      setMessageType('error');
      return;
    }

    // Validate role
    if (!['user', 'admin'].includes(formData.role)) {
      setMessage('Le rôle doit être "user" ou "admin".');
      setMessageType('error');
      return;
    }

    // Check if user is admin
    if (userRole !== 'admin') {
      setMessage('Seuls les administrateurs peuvent ajouter des utilisateurs.');
      setMessageType('error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      console.log('Sending request with token:', token);
      console.log('Payload:', formData);
      const response = await axios.post(
        'http://127.0.0.1:8000/api/users-store',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Utilisateur ajouté avec succès !');
      setMessageType('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        age: '',
        phone: '',
        address: '',
      });
      // Stay on the same page
    } catch (error) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      };
      console.error('Erreur lors de l\'ajout de l\'utilisateur :', errorDetails);
      setMessage(
        error.response?.data?.message ||
          'Une erreur est survenue lors de l’ajout de l’utilisateur.'
      );
      setMessageType('error');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`w-full ${darkMode ? 'bg-gray-800 header-shadow-dark' : 'bg-white header-shadow'} p-4 flex justify-between items-center`}>
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BiblioGest</span>
          <nav className="ml-6 space-x-4">
            <Link
              to="/admin-dashboard"
              className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              Accueil
            </Link>
            <Link
              to="/Bibliotheque"
              className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              Livres
            </Link>
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
        <div className={`${darkMode ? 'bg-gray-800 card-shadow-dark' : 'bg-white card-shadow'} rounded-lg p-6 w-full max-w-2xl`}>
          <h1 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ajouter un utilisateur
          </h1>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-8`}>
            Ajoutez un nouvel utilisateur à la plateforme
          </p>

          {message && (
            <div
              className={`message ${
                messageType === 'success' ? 'message-success' : 'message-error'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="name"
              >
                Nom
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nom"
                value={formData.name}
                onChange={handleChange}
                required
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="password"
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="password_confirmation"
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmer le mot de passe"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="role"
              >
                Rôle (user ou admin)
              </label>
              <input
                type="text"
                name="role"
                placeholder="Par défaut : user"
                value={formData.role}
                onChange={handleChange}
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="age"
              >
                Âge
              </label>
              <input
                type="number"
                name="age"
                placeholder="Âge"
                value={formData.age}
                onChange={handleChange}
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="phone"
              >
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={handleChange}
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                htmlFor="address"
              >
                Adresse
              </label>
              <input
                type="text"
                name="address"
                placeholder="Adresse"
                value={formData.address}
                onChange={handleChange}
                className="search-input w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button type="submit" className="main-button">
                Ajouter l'utilisateur
              </button>
              <Link to="/admin-dashboard">
                <button type="button" className="secondary-button">
                  Annuler
                </button>
              </Link>
            </div>
          </form>
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

export default AddUser;