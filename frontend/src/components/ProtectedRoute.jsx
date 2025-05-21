import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Vérifier si l'utilisateur est authentifié et obtenir son rôle
  const isAuthenticated = localStorage.getItem('token');
  const userRole = JSON.parse(localStorage.getItem('userRole')) || '';

  // Si l'utilisateur n'est pas authentifié, redirige vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est authentifié, on montre ses enfants
  return children;
};

export default ProtectedRoute;
