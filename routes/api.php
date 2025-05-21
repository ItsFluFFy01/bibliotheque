<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\BookController;
use App\Http\Controllers\API\StatistiquesController;

// Routes d'authentification
Route::post('/login', [AuthController::class, 'login']);  // Connexion d'un utilisateur
Route::post('/register', [AuthController::class, 'register']);  // Inscription d'un utilisateur

Route::middleware('auth:sanctum')->group(function () {
    // Routes nécessitant une authentification via Sanctum
    Route::post('logout', [AuthController::class, 'logout']);  // Déconnexion
    Route::post('/books', [BookController::class, 'store']); // <- ajout d'un livre
    Route::get('/Allbooks', [BookController::class, 'index']);
    Route::get('/books/{book}', [BookController::class, 'show']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
    Route::get('user-dashboard', [UserController::class, 'dashboardInfo']);  // Liste des utilisateurs



    // CRUD pour les utilisateurs - accessible uniquement pour les admins
    Route::middleware('auth')->group(function () {
    Route::get('users', [UserController::class, 'index']); 
    Route::get('admin-dashboard', [UserController::class, 'adminDashboard']);
    Route::get('stats', [UserController::class, 'stats']);
    Route::post('users-store', [UserController::class, 'store']);
    Route::get('users-show/{id}', [UserController::class, 'show']);
    Route::put('users-update/{id}', [UserController::class, 'update']);
    Route::delete('users-destroy/{id}', [UserController::class, 'destroy']);
    Route::get('/bibliotheque', [BookController::class, 'indexAll']);
    Route::get('/stats/livres-par-utilisateur', [UserController::class, 'livresParUtilisateur']);

});

    // CRUD pour les livres - accessible pour tout utilisateur authentifié
    Route::apiResource('books', BookController::class);  // CRUD sur les livres
});

use Illuminate\Http\Request;

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});


