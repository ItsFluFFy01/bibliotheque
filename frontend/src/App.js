import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import UsersDashboard from './components/UsersDashboard';
import UserProfile from './components/UserProfile'; 
import UserShow from './components/UserShow';
import UserUpdate from './components/UserUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard'; 
import AddUser from './components/AddUser';
import UserList from './components/UserList';  
import Bibliotheque from './components/Bibliotheque';
import Statistiques from './components/Statistiques';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Route vers la page de connexion */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes protégées */}
          <Route 
            path="/books" 
            element={<ProtectedRoute><BookList /></ProtectedRoute>} 
          />
          <Route 
            path="/add-book" 
            element={<ProtectedRoute><AddBook /></ProtectedRoute>} 
          />
          <Route
            path="/user-dashboard"
            element={<ProtectedRoute><UsersDashboard /></ProtectedRoute>}
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><UserProfile /></ProtectedRoute>} 
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
          />
          <Route 
            path="/add-user" 
            element={<ProtectedRoute><AddUser /></ProtectedRoute>} 
          />
          <Route 
            path="/users" 
            element={<ProtectedRoute><UserList /></ProtectedRoute>} 
          />
          <Route 
            path="/users-show/:id" 
            element={<ProtectedRoute><UserShow /></ProtectedRoute>} 
          />
          <Route 
            path="/users-update/:id" 
            element={<ProtectedRoute><UserUpdate /></ProtectedRoute>} 
          />
          
          {/* 📚 Route Bibliothèque */}
          <Route 
            path="/bibliotheque" 
            element={<ProtectedRoute><Bibliotheque /></ProtectedRoute>} 
          />
          <Route 
            path="/statistiques" 
            element={<ProtectedRoute><Statistiques /></ProtectedRoute>} 
          />

          {/* Redirection vers login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
