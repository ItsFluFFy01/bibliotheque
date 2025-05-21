<?php

namespace App\Http\Controllers\API;

use App\Models\Book;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BookController extends Controller
{
   public function index()
{
    $user = auth()->user(); // Récupère l'utilisateur connecté
    $books = Book::where('user_id', $user->id)->get();
    return response()->json($books);
}

public function indexAll()
{
    // Vérifie que c'est un administrateur si tu veux restreindre
    if (auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Récupère tous les livres avec l'utilisateur associé (auteur) et son nom
    $books = Book::with('user:id,name')->get();

    return response()->json($books);
}



    public function show(Book $book)
{
     if ($book->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    if (!$book) {
        return response()->json(['message' => 'Book not found'], 404);
    }

    return response()->json($book);
}


   public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255|unique:books,title,NULL,NULL,user_id,' . auth()->id(),
        'description' => 'required|string',
    ]);

    // Créer uniquement les attributs spécifiés
    $book = Book::create([
        'title' => $request->title,
        'description' => $request->description,
        'user_id' => auth()->id(), // Ajout de l'auteur
    ]);

    return response()->json($book, 201);
}



   public function update(Request $request, Book $book)
{
    // Vérifier si l'utilisateur connecté est bien le propriétaire du livre
    if ($book->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
    ]);

    $book->update($request->all());
    return response()->json($book);
}


    public function destroy(Book $book)
{
    // Vérifier si l'utilisateur connecté est bien le propriétaire du livre
    if ($book->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $book->delete();
    return response()->json(null, 204);
}
}

