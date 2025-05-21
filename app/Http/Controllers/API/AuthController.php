<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Inscription de l'utilisateur
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully']);
    }

    // Connexion de l'utilisateur
   public function login(Request $request)
{
    // Validation des entrées
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:6',
    ]);

    // Log pour vérifier les entrées
    \Log::info('Tentative de connexion:', ['email' => $request->email]);

    // Recherche de l'utilisateur par email
    $user = User::where('email', $request->email)->first();

    // Log si l'utilisateur n'est pas trouvé
    if (!$user) {
        \Log::warning('Utilisateur non trouvé:', ['email' => $request->email]);
    }

    // Vérification des identifiants
    if (!$user || !Hash::check($request->password, $user->password)) {
        // Log pour identifier le problème
        \Log::warning('Identifiants incorrects:', ['email' => $request->email]);

        return response()->json([
            'message' => 'Ces identifiants sont incorrects.',
        ], 401);
    }

    // Création du token d'authentification
    $token = $user->createToken('API Token')->plainTextToken;

    // Retourne une réponse JSON avec le token et l'utilisateur
    return response()->json([
    'token' => $token,
    'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role, // <-- Assure-toi que ce champ existe
    ],
]);
}

    // Déconnexion de l'utilisateur
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
