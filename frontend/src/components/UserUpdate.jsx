import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './UserUpdate.css';

function UserUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    address: '',
  });
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: response.data.name || '',
          email: response.data.email || '',
          age: response.data.age || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        if (error.response && error.response.status === 401) {
          showNotification('error', 'Session expirée. Redirection vers la page de connexion...');
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response && error.response.status === 404) {
          navigate('/not-found');
        } else {
          showNotification('error', 'Impossible de charger les données utilisateur');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message
    });

    // Auto-hide notification after 5 seconds if it's a success
    if (type === 'success') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://127.0.0.1:8000/api/users-update/${id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification('success', 'Profil mis à jour avec succès!');
      
      // Scroll to top to ensure user sees the notification
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      if (error.response) {
        if (error.response.status === 404) {
          showNotification('error', 'Erreur : L\'endpoint de mise à jour n\'existe pas. Vérifiez la configuration du serveur.');
        } else if (error.response.status === 422) {
          showNotification('error', 'Erreur de validation : ' + JSON.stringify(error.response.data.errors));
        } else if (error.response.status === 401) {
          showNotification('error', 'Session expirée. Veuillez vous reconnecter.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          showNotification('error', `Erreur ${error.response.status}: ${error.response.data.message || 'Erreur inconnue.'}`);
        }
      } else if (error.message === 'Network Error') {
        showNotification('error', 'Erreur réseau : Vérifiez si le serveur est en marche.');
      } else {
        showNotification('error', 'Erreur lors de la mise à jour du profil.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`user-update-container ${darkMode ? 'dark' : ''}`}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-update-container ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="app-header header-shadow">
        <div className="header-content">
          <div className="header-left">
            <span className="app-logo">BiblioGest</span>
            <nav className="main-nav">
              <a href="/user-dashboard" className="nav-link">Accueil</a>
              <a href="/books" className="nav-link">Livres</a>
              <a href="/profile" className="nav-link">Profil</a>
            </nav>
          </div>
          <div className="header-right">
            <div className="user-greeting">
              Bonjour, {user.name || 'Utilisateur'}
            </div>
            <button
              onClick={toggleTheme}
              className="theme-toggle-button"
              aria-label={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {darkMode ? (
                <svg className="theme-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="theme-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v-7a3 3 0 00-3-3H5" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="form-card card-shadow">
          <div className="page-header">
            <h1 className="page-title">Modifier le Profil</h1>
            <p className="page-subtitle">Mettez à jour vos informations personnelles</p>
          </div>

          {notification.show && (
            <div className={`message ${notification.type === 'success' ? 'message-success' : 'message-error'}`}>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Âge</label>
              <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <Link to={`/users`} className="cancel-link">
                <button
                  type="button"
                  className="cancel-button"
                >
                  Annuler
                </button>
              </Link>
              <button
                type="submit"
                className="save-button"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer header-shadow">
        <span className="copyright">BiblioGest © 2025</span>
        <div className="footer-links">
          <button className="footer-link">Aide</button>
          <span className="footer-divider">|</span>
          <button className="footer-link">Paramètres</button>
        </div>
      </footer>
    </div>
  );
}

export default UserUpdate;