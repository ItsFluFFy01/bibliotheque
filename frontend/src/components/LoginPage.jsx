import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Envoi de la requête POST pour la connexion - Logique inchangée
    axios.post('http://127.0.0.1:8000/api/login', { email, password })
      .then((response) => {
        // Stocker le token dans localStorage
        localStorage.setItem('token', response.data.token);

        // Récupérer les données utilisateur
        const user = response.data.user;
        setUserData(user);

        // Redirection en fonction du rôle
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      })
      .catch((error) => {
        // Gestion des erreurs en fonction de la réponse de l'API
        if (error.response) {
          console.error('Réponse d\'erreur du backend:', error.response);
          
          // Si le backend retourne une erreur 401 (identifiants incorrects)
          if (error.response.status === 401) {
            setError(error.response.data.message || 'Identifiants incorrects');
          } else {
            setError('Une erreur est survenue lors de la connexion');
          }
        }
        // Si aucune réponse (problème réseau, API down, etc.)
        else if (error.request) {
          console.error('Détails de la requête:', error.request);
          setError('Erreur lors de l\'envoi de la requête');
        }
        // Autre type d'erreur
        else {
          console.error('Erreur complète:', error);
          setError('Erreur inconnue lors de la connexion');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      {/* Panneau gauche avec image */}
      <div className="login-image-panel">
        <div className="login-overlay">
          <h1 className="login-brand">Bibliothèque Virtuelle</h1>
          <p className="login-tagline">Votre portail vers un monde de connaissances</p>
        </div>
      </div>
      
      {/* Panneau de connexion */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="book-icon">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h2 className="login-title">Bienvenue</h2>
            <p className="login-subtitle">Connectez-vous à votre compte</p>
          </div>
          
          {error && <div className="login-error">{error}</div>}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Se souvenir de moi</label>
              </div>
              <a href="#" className="forgot-password">Mot de passe oublié?</a>
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="signup-link">
            <p>Vous n'avez pas de compte? <a href="#">S'inscrire</a></p>
          </div>
          
          {userData && (
            <div className="welcome-message">
              <h3>Bienvenue, {userData.name}</h3>
              <p>Email: {userData.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;