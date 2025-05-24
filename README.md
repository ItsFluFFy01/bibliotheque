# 📚 Projet DevWeb – Application de Gestion de Bibliothèque

Cette application web permet de gérer une bibliothèque avec une interface utilisateur en **ReactJS** (frontend) et une **API RESTful** en **Laravel** (backend).

Elle intègre une **authentification multi-rôles** (Admin et User).

## 📋 Fonctionnalités

### Pour les Administrateurs
- Gestion complète des utilisateurs (CRUD)
  - Ajouter de nouveaux utilisateurs
  - Modifier les informations des utilisateurs existants
  - Supprimer des utilisateurs
  - Visualiser le profil de chaque utilisateur
  - Visualiser la liste des utilisateurs
- Gestion complète des livres (CRUD)
  - Visualiser tous les livres disponibles
- Tableau de bord avec statistiques
  - Nombre de livres par utilisateurs

### Pour les Utilisateurs
- Consulter la liste de ses livres
- Recherche de livres par titre
- Gestion des livres (CRUD)
  - Ajouter de nouveaux livres
  - Modifier les informations des livres
  - Supprimer des livres

## 🛠️ Technologies Utilisées

### Front-end
- ReactJS
- React Router pour la navigation
- Axios pour les requêtes API
- Bootstrap ou Material UI pour les composants d'interface

### Back-end
- Laravel (API RESTful)
- Authentification JWT
- MySQL pour la base de données
- Eloquent ORM

## 🚀 Installation & Lancement du projet

### 🧱 Prérequis
- PHP ≥ 8.1
- Composer
- Node.js ≥ 16
- npm
- MySQL ou MariaDB

### 1. Cloner le projet
```bash
git clone https://github.com/ItsFluFFy01/bibliotheque.git
cd bibliotheque
```

### 2. Installation du Back-end (Laravel)

```bash

# Installation des dépendances
composer install

# Configuration de l'environnement
cp .env.example .env
php artisan key:generate

# Configuration de la base de données dans le fichier .env
# Modifier les valeurs selon votre configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bibliotheque
DB_USERNAME=root
DB_PASSWORD=

# Migration de la base de données
php artisan migrate

# (Optionnel) Remplir la base de données avec des données de test
php artisan db:seed

# Lancer le serveur
php artisan serve
```

### 3. Installation du Front-end (ReactJS)

```bash
cd bibliotheque/frontend

# Installation des dépendances
npm install

# Configuration de l'URL de l'API dans le fichier .env
# Créer un fichier .env s'il n'existe pas
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Lancer l'application
npm start
```

## 💾 Structure de la Base de Données

La base de données comprend les tables principales suivantes :
- `users` - Informations sur les utilisateurs et administrateurs
- `books` - Catalogue des livres disponibles

## 🔑 Accès à l'Application

### Accès Administrateur
- Email: admin@gmail.com
- Mot de passe: admin123

### Accès Utilisateur
- Email: imane@gmail.com
- Mot de passe: Imane1234


## 📞 Contact

Pour toute question ou assistance, veuillez contacter [misbahlamiae23@gmail.com]