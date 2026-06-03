<?php

namespace App\Policies;

use App\Models\Shareholder;
use App\Models\User;

class ShareholderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Shareholder $shareholder): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Shareholder $shareholder): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Shareholder $shareholder): bool
    {
        return $user->isAdmin();
    }
}
