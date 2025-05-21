<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Exécute le seeder.
     */
    public function run()
    {
        // Utilisateur simple
        User::create([
            'name' => 'Utilisateur Test',
            'email' => 'user@gmail.com',
            'password' => Hash::make('user123'),
        ]);
        // Admin
       User::create([
    'name' => 'Administrateur',
    'email' => 'admin@gmail.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin', // Ajout du rôle
]);

    }
}
