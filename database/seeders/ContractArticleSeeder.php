<?php

namespace Database\Seeders;

use App\Models\ContractArticle;
use Illuminate\Database\Seeder;

class ContractArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'ARTICLE 1',
                'description' => 'Les parties reconnaissent a se contracter et agir en conformité avec les règles juridiques, sans conquérir et de bonne foi.',
                'article_order' => 1,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 2',
                'description' => "Les deux parties ont convenu que ce contrat n'est pas un contrat de vente définitif. Et n'approuve pas la propriété de du bien immobilier qu'après avoir payé la totalité du prix du bien immobilier par la première partie et la conclusion finale du contrat de vente définitif chez le Notaire et le respect des formalités et conditions prévues par la loi.",
                'article_order' => 2,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 3',
                'description' => "La première partie reconnaît qu'il garde le droit de la deuxième partie dans l'acquisition d'un Local commercial dans le projet de logements nommé {projectName}, selon les spécifications suivantes :<br>".
                                 "<ul style='margin-top: 5px;'>".
                                 "<li><u>Superficie approximative</u> : {area}m² (superficie communiqué par l'architecte selon le plan de construction et la superficie utile sera déterminer ultérieurement par l'administration de la conservation foncière).</li>".
                                 '<li><u>La vue</u> : Local commercial avec 3</li>'.
                                 '<li><u>N° Local commercial</u> : {projectName} {propertyName}</li>'.
                                 "<li><u>L'état de Local commercial conformément à l'accord</u>: ??????? ???????? ??????</li>".
                                 '<li><u>Titre mère de terrain</u> : 55f/888888</li>'.
                                 '<li><u>Sous-sol</u> :'.
                                 '  <ul>'.
                                 '      <li><u>Sous-sol</u>: 5-P-5</li>'.
                                 '      <li><u>Prix</u>: 0,00</li>'.
                                 '  </ul>'.
                                 '</li>'.
                                 '</ul>',
                'article_order' => 3,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 4',
                'description' => "La deuxième partie paye pour la première partie une avance de 5 000,00 DH. (), en contrepartie d'une quittance détaillée comme seul preuve de paiement, et cela dans un délai ne dépasse pas 10 jours à compter de la date de signature de cette contrat.",
                'article_order' => 4,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 5',
                'description' => "Les deux parties sont en accord du prix définitif de Local commercial soit : {price} DH. () payé par la deuxième partie en faveur de la première sous forme des échéances à compter de la date de première avance jusqu'au achèvement des travaux de la construction et la finition soit une échéance de 80 000,00 DH chaque 1 mois, à partir de la date de signature du présente acte.",
                'article_order' => 5,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 6',
                'description' => "En cas retard de paiement des échéances fixé dans l'article 5, la première partie a le droit d'envoyer un écrit sous forme d'avertissement dans l'adresse fixée par la deuxième partie.",
                'article_order' => 6,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 7',
                'description' => 'La première partie détermine un délai maximum de 15 jours dans son écrit destiné à la deuxième partie à partir de la date de livraison.',
                'article_order' => 7,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 8',
                'description' => "La deuxième partie approuve que l'adresse choisi par elle-même dans ce contrat représente ca vrai domicile, et qu'elle assume la responsabilité total en cas de retour du courir fixé dans l'article 7 pour quelque soit le motif.",
                'article_order' => 8,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 9',
                'description' => "La première partie s'engage en cas d'expiration du délai de 15 jours fixé dans le courir destiné a la deuxième partie, de restituer le montant de l'avance ainsi que la somme des échéances payés par la deuxième partie sans aucun prélèvement, dommage au pénalité. Et cela après récupération de toute quittance de paiement délivré par la première partie. Cette dernière s'engage aussi de faire comme en cas de livraisons de l'appartement en état des gros ouvres après expiration du délai de 90 jours pour que la deuxième partie accompli les travaux de la finition du bien immobilier.",
                'article_order' => 9,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 10',
                'description' => 'Après expiration des délais fixés dans ce contrat, le bien immobilier sera à la disposition de la première partie.',
                'article_order' => 10,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 11',
                'description' => "La deuxième partie n'a pas le droit de demander aucune indemnité amicalement ou judiciairement après expiration des délais fixés dans les articles 7 et 9, sauf la restitution des fonds déjà versé en profit de la première partie.",
                'article_order' => 11,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE 12',
                'description' => "En cas de litige les deux parties sont d'accord de soumettre cette contrat aux dispositions du deuxième paragraphe de l'article 114 du droit des contrats et des obligations.",
                'article_order' => 12,
                'status' => 'active',
            ],
            [
                'title' => 'ARTICLE FINAL',
                'description' => "Le présent acte est un contrat coutumier et s'engage les deux parties et conserve leur droits au moment de la signature et sans l'obligation de l'égaliser les signatures dans l'attente de rédiger l'acte de vente définitif sous les dispositions et les formalités fixé par la loi marocain.",
                'article_order' => 13,
                'status' => 'active',
            ],
        ];

        foreach ($articles as $article) {
            ContractArticle::create($article);
        }
    }
}
