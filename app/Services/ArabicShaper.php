<?php

namespace App\Services;

class ArabicShaper
{
    private static $map = [
        // char => [isolated, final, initial, medial]
        'ء' => ["\u{FE80}", null, null, null],
        'آ' => ["\u{FE81}", "\u{FE82}", null, null],
        'أ' => ["\u{FE83}", "\u{FE84}", null, null],
        'ؤ' => ["\u{FE85}", "\u{FE86}", null, null],
        'إ' => ["\u{FE87}", "\u{FE88}", null, null],
        'ئ' => ["\u{FE89}", "\u{FE8A}", "\u{FE8B}", "\u{FE8C}"],
        'ا' => ["\u{FE8D}", "\u{FE8E}", null, null],
        'ب' => ["\u{FE8F}", "\u{FE90}", "\u{FE91}", "\u{FE92}"],
        'ة' => ["\u{FE93}", "\u{FE94}", null, null],
        'ت' => ["\u{FE95}", "\u{FE96}", "\u{FE97}", "\u{FE98}"],
        'ث' => ["\u{FE99}", "\u{FE9A}", "\u{FE9B}", "\u{FE9C}"],
        'ج' => ["\u{FE9D}", "\u{FE9E}", "\u{FE9F}", "\u{FEA0}"],
        'ح' => ["\u{FEA1}", "\u{FEA2}", "\u{FEA3}", "\u{FEA4}"],
        'خ' => ["\u{FEA5}", "\u{FEA6}", "\u{FEA7}", "\u{FEA8}"],
        'د' => ["\u{FEA9}", "\u{FEAA}", null, null],
        'ذ' => ["\u{FEAB}", "\u{FEAC}", null, null],
        'ر' => ["\u{FEAD}", "\u{FEAE}", null, null],
        'ز' => ["\u{FEAF}", "\u{FEB0}", null, null],
        'س' => ["\u{FEB1}", "\u{FEB2}", "\u{FEB3}", "\u{FEB4}"],
        'ش' => ["\u{FEB5}", "\u{FEB6}", "\u{FEB7}", "\u{FEB8}"],
        'ص' => ["\u{FEB9}", "\u{FEBA}", "\u{FEBB}", "\u{FEBC}"],
        'ض' => ["\u{FEBD}", "\u{FEBE}", "\u{FEBF}", "\u{FEC0}"],
        'ط' => ["\u{FEC1}", "\u{FEC2}", "\u{FEC3}", "\u{FEC4}"],
        'ظ' => ["\u{FEC5}", "\u{FEC6}", "\u{FEC7}", "\u{FEC8}"],
        'ع' => ["\u{FEC9}", "\u{FECA}", "\u{FECB}", "\u{FECC}"],
        'غ' => ["\u{FECD}", "\u{FECE}", "\u{FECF}", "\u{FED0}"],
        'ف' => ["\u{FED1}", "\u{FED2}", "\u{FED3}", "\u{FED4}"],
        'ق' => ["\u{FED5}", "\u{FED6}", "\u{FED7}", "\u{FED8}"],
        'ك' => ["\u{FED9}", "\u{FEDA}", "\u{FEDB}", "\u{FEDC}"],
        'ل' => ["\u{FEDD}", "\u{FEDE}", "\u{FEDF}", "\u{FEE0}"],
        'م' => ["\u{FEE1}", "\u{FEE2}", "\u{FEE3}", "\u{FEE4}"],
        'ن' => ["\u{FEE5}", "\u{FEE6}", "\u{FEE7}", "\u{FEE8}"],
        'ه' => ["\u{FEE9}", "\u{FEEA}", "\u{FEEB}", "\u{FEEC}"],
        'و' => ["\u{FEED}", "\u{FEEE}", null, null],
        'ى' => ["\u{FEEF}", "\u{FEF0}", null, null],
        'ي' => ["\u{FEF1}", "\u{FEF2}", "\u{FEF3}", "\u{FEF4}"],

        // Lam-Alef Ligatures
        'لآ' => ["\u{FEF5}", "\u{FEF6}", null, null],
        'لأ' => ["\u{FEF7}", "\u{FEF8}", null, null],
        'لإ' => ["\u{FEF9}", "\u{FEFA}", null, null],
        'لا' => ["\u{FEFB}", "\u{FEFC}", null, null],
    ];

    private static function connectsLeft($char)
    {
        if (! isset(self::$map[$char])) {
            return false;
        }

        return self::$map[$char][2] !== null || self::$map[$char][3] !== null;
    }

    private static function connectsRight($char)
    {
        return isset(self::$map[$char]);
    }

    public static function isArabic($char)
    {
        if (empty($char)) {
            return false;
        }
        $codepoint = self::getCodepoint($char);

        return ($codepoint >= 0x0600 && $codepoint <= 0x06FF) ||
               ($codepoint >= 0xFB50 && $codepoint <= 0xFDFF) ||
               ($codepoint >= 0xFE70 && $codepoint <= 0xFEFF);
    }

    private static function getCodepoint($char)
    {
        $k = mb_convert_encoding($char, 'UTF-32LE', 'UTF-8');
        $val = unpack('V', $k);

        return $val[1];
    }

    /**
     * Shape a single word of Arabic characters and reverse it.
     */
    private static function shapeWord($word)
    {
        $word = preg_replace('/[\x{064B}-\x{065F}\x{0670}]/u', '', $word);
        $chars = preg_split('//u', $word, -1, PREG_SPLIT_NO_EMPTY);
        $n = count($chars);
        if ($n === 0) {
            return '';
        }

        $processed = [];
        for ($i = 0; $i < $n; $i++) {
            if ($chars[$i] === 'ل' && $i < $n - 1) {
                $next = $chars[$i + 1];
                $ligature = null;
                if ($next === 'آ') {
                    $ligature = 'لآ';
                } elseif ($next === 'أ') {
                    $ligature = 'لأ';
                } elseif ($next === 'إ') {
                    $ligature = 'لإ';
                } elseif ($next === 'ا') {
                    $ligature = 'لا';
                }

                if ($ligature !== null) {
                    $processed[] = $ligature;
                    $i++;

                    continue;
                }
            }
            $processed[] = $chars[$i];
        }

        $chars = $processed;
        $n = count($chars);
        $shaped = [];

        for ($i = 0; $i < $n; $i++) {
            $char = $chars[$i];

            if (! isset(self::$map[$char])) {
                $shaped[] = $char;

                continue;
            }

            $prev = ($i > 0) ? $chars[$i - 1] : null;
            $next = ($i < $n - 1) ? $chars[$i + 1] : null;

            $canConnectRight = ($prev !== null && self::connectsRight($char) && self::connectsLeft($prev));
            $canConnectLeft = ($next !== null && self::connectsLeft($char) && self::connectsRight($next));

            $entry = self::$map[$char];
            $isolated = $entry[0];
            $final = $entry[1] ?? $isolated;
            $initial = $entry[2] ?? $isolated;
            $medial = $entry[3] ?? ($entry[2] ?? $isolated);

            if ($canConnectRight && $canConnectLeft) {
                $shaped[] = $medial;
            } elseif ($canConnectRight) {
                $shaped[] = $final;
            } elseif ($canConnectLeft) {
                $shaped[] = $initial;
            } else {
                $shaped[] = $isolated;
            }
        }

        return implode('', array_reverse($shaped));
    }

    /**
     * Shape Arabic words while keeping spaces, punctuation, and non-Arabic segments in original order.
     */
    public static function shape($text)
    {
        if (empty($text)) {
            return '';
        }

        // Split by non-Arabic word boundary to isolate Arabic words
        $parts = preg_split('/([^\x{0621}-\x{064A}\x{06C0}-\x{06D3}\x{0671}-\x{06B8}]+)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE);

        $shapedParts = [];
        foreach ($parts as $part) {
            if ($part === '' || $part === null) {
                continue;
            }
            if (self::isArabic(mb_substr($part, 0, 1))) {
                $shapedParts[] = self::shapeWord($part);
            } else {
                $shapedParts[] = $part;
            }
        }

        return implode('', $shapedParts);
    }
}
