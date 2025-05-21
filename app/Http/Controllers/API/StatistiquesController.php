<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatistiquesController extends Controller
{
  public function livresParUtilisateur(): JsonResponse
{
    try {
        \Log::info('Appel à la méthode livresParUtilisateur');
        $stats = User::withCount('books')->get()->map(function ($user) {
            return [
                'name' => $user->name,
                'book_count' => $user->books_count,
            ];
        });
        \Log::info('Données récupérées : ', $stats->toArray());
        return response()->json($stats);
    } catch (\Exception $e) {
        \Log::error('Erreur dans livresParUtilisateur : ' . $e->getMessage());
        \Log::error('Trace de l\'erreur : ' . $e->getTraceAsString());
        return response()->json([
            'message' => 'Erreur serveur',
            'error' => $e->getMessage(),
            'trace' => $e->getTrace()
        ], 500);
    }
}


}
