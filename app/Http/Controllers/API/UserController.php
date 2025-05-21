<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class UserController extends Controller
{
    public function adminDashboard()
{
    // Exemple de données : à adapter selon ton besoin
    return response()->json([
        'message' => 'Bienvenue sur le tableau de bord admin',
        'users_count' => User::count(),
        'books_count' => Book::count(), // si tu as un modèle Book
    ]);
}

    // Liste des utilisateurs (accessible uniquement par admin)
   public function dashboardInfo()
    {
        $user = auth()->user();

        // Vérifier si l'utilisateur a bien le rôle 'admin'
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'user' => $user,
            'role' => $user->role,
        ]);
    }
     public function index()
    {
        // Récupérer tous les utilisateurs (ou personnaliser la requête si besoin)
        $users = User::all();

        // Retourner la liste des utilisateurs sous forme de réponse JSON
        return response()->json($users);
    }


 public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|same:password_confirmation',
            'password_confirmation' => 'required|string|min:6',
            'role' => 'required|string|in:user,admin', // Validate role
            'age' => 'nullable|integer|min:0',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'], // Use provided role
            'age' => $validated['age'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user,
        ], 201);
    }


    public function show($id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Optional: Authorization (e.g., restrict to authenticated users or admins)
        // if (auth()->user()->id !== $user->id && !auth()->user()->hasRole('admin')) {
        //     abort(403, 'Unauthorized');
        // }

        // Return user data as JSON
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'age' => $user->age,
            'phone' => $user->phone,
            'address' => $user->address,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    }


    // Mise à jour des informations d'un utilisateur
  public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'age' => 'nullable|integer|min:0',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            // Password is optional; if provided, it must match confirmation
            'password' => 'nullable|string|min:6|same:password_confirmation',
            'password_confirmation' => 'nullable|string|min:6',
        ]);

        // Prepare data for update
        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'age' => $validated['age'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ];

        // Update password only if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user,
        ], 200);
    }


    // Suppression d'un utilisateur
    public function destroy($id)
{
    $user = User::findOrFail($id);  // Trouver l'utilisateur
    $user->delete();  // Supprimer l'utilisateur
    return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
}
 public function livresParUtilisateur()
{
        $stats = User::where('role', 'user')  // Filtrer par la colonne 'role'
            ->withCount('books')              // Compter les livres associés
            ->get()
            ->map(function ($user) {
                return [
                    'name' => $user->name,
                    'book_count' => $user->books_count,
                ];
            });

        return response()->json($stats);

   
}


}
