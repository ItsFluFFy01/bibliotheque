import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AddBook.css';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // Pour distinguer succès ou erreur
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/books', {
        title,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessage('Livre ajouté avec succès !');
      setMessageType('success'); // Définir le type de message comme succès
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre :', error);
      setMessage("Erreur lors de l'ajout du livre.");
      setMessageType('error'); // Définir le type de message comme erreur
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white header-shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900">BiblioGest</span>
          <nav className="ml-6 space-x-4">
            <Link to="/user-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Accueil</Link>
            <Link to="/books" className="text-gray-600 hover:text-blue-600 transition-colors">Livres</Link>
          </nav>
        </div>
        <div className="relative text-gray-800 font-semibold">
          Bonjour, {userName}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white card-shadow rounded-lg p-6 w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">Ajouter un livre</h1>
          <p className="text-center text-gray-500 mb-8">Ajoutez un nouveau livre à votre bibliothèque</p>
          
          {message && (
            <div className={`message ${
              messageType === 'success' 
                ? 'message-success' 
                : 'message-error'
            }`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2" htmlFor="title">
                Titre du livre
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="search-input w-full p-3 border border-gray-200 rounded"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="search-input w-full p-3 border border-gray-200 rounded min-h-32"
                rows="6"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-center gap-4">
              <button type="submit" className="main-button">
                Ajouter le livre
              </button>
              <Link to="/user-dashboard">
                <button type="button" className="secondary-button">
                  Annuler
                </button>
              </Link>
            </div>
          </form>
          

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white header-shadow p-4 flex justify-between items-center">
        <span className="text-gray-600">BiblioGest © 2025</span>
        <div>
          <button className="text-gray-600 hover:text-blue-600 mx-2 transition-colors">Aide</button>
          <span className="mx-2 text-gray-400">|</span>
          <button className="text-gray-600 hover:text-blue-600 mx-2 transition-colors">Paramètres</button>
        </div>
      </footer>
    </div>
  );
};

export default AddBook;