import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BookList.css'; // Nouveau fichier CSS

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', description: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

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

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/Allbooks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livres:', error);
      setMessage('Erreur lors de la récupération des livres.');
      setMessageType('error');
      clearMessage();
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/books',
        newBook,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks([...books, response.data]);
      setNewBook({ title: '', description: '' });
      setMessage('Livre ajouté avec succès!');
      setMessageType('success');
    } catch (error) {
      setMessage("Erreur lors de l'ajout du livre.");
      setMessageType('error');
    }
    clearMessage();
  };

 const handleDeleteBook = async (id) => {
  const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?');
  
  if (!isConfirmed) {
    return; // Si l'utilisateur annule, on arrête l'exécution de la suppression
  }

  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://127.0.0.1:8000/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks(books.filter((book) => book.id !== id));
    setMessage('Livre supprimé avec succès!');
    setMessageType('success');
  } catch (error) {
    setMessage('Erreur lors de la suppression du livre.');
    setMessageType('error');
  }
  clearMessage();
};

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://127.0.0.1:8000/api/books/${editingBook.id}`, editingBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(
        books.map((book) =>
          book.id === editingBook.id ? editingBook : book
        )
      );
      setEditingBook(null);
      setMessage('Livre mis à jour avec succès!');
      setMessageType('success');
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du livre.");
      setMessageType('error');
    }
    clearMessage();
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
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
        <div className="bg-white card-shadow rounded-lg p-6 w-full max-w-6xl book-list-container">
          <div className="page-header">
            <h1 className="page-title">Liste des Livres</h1>
            <p className="page-subtitle">Gérez votre collection de livres</p>
          </div>
          
          {message && (
            <div className={`message ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-between mb-4">
            <Link to="/add-book">
              <button className="add-button">
                Ajouter un nouveau livre
              </button>
            </Link>
          </div>

          {books.length > 0 ? (
            <table className="books-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    {editingBook?.id === book.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingBook.title}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, title: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingBook.description}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, description: e.target.value })
                            }
                          />
                        </td>
                        <td>{new Date(book.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="save-button"
                            onClick={handleUpdateBook}
                          >
                            Sauvegarder
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => setEditingBook(null)}
                          >
                            Annuler
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{book.title}</td>
                        <td>{book.description}</td>
                        <td>{new Date(book.created_at).toLocaleDateString()}</td>
                        <td className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => setEditingBook(book)}
                          >
                            Modifier
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-10 text-gray-500">
              <p className="mb-4">Aucun livre trouvé.</p>
              
            </div>
          )}

          <div className="mt-4">
            <Link to="/user-dashboard">
              <button className="back-button">
                Retour
              </button>
            </Link>
          </div>
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

export default BookList;
