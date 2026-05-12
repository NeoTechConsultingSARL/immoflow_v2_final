<?php

namespace App\Enums;

enum ClientType: string
{
    case Individual = 'individual';
    case Company = 'company';
    case Lead = 'lead';
    case Prospect = 'prospect';
    case Owner = 'owner';

    public function getLabel(): string
    {
        return match($this) {
            self::Individual => 'Individual',
            self::Company => 'Company',
            self::Lead => 'Lead',
            self::Prospect => 'Prospect',
            self::Owner => 'Owner',
        };
    }

    public static function getValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function getLabels(): array
    {
        return array_map(fn($case) => $case->getLabel(), self::cases());
    }
}
