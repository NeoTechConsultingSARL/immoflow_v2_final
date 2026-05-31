<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractArticle;

class ContractPdfService
{
    public function getClauses(Contract $contract, string $lang = 'fr')
    {
        $property = $contract->property;
        $bloc = $property ? $property->bloc : null;
        $tranche = $bloc ? $bloc->tranche : null;
        $project = $tranche ? $tranche->project : null;

        $projectName = $project ? $project->name : 'N/A';
        $propertyName = $property ? $property->name : 'N/A';
        $area = $property ? $property->area : '0.00';
        $price = $contract->price ? number_format($contract->price, 2, ',', ' ') : '0,00';

        $articles = ContractArticle::active()
            ->orderBy('article_order', 'asc')
            ->get();

        $translations = [
            'en' => [
                'ARTICLE 1' => [
                    'title' => 'ARTICLE 1',
                    'description' => 'The parties agree to contract and act in compliance with legal rules, without misrepresentation and in good faith.',
                ],
                'ARTICLE 2' => [
                    'title' => 'ARTICLE 2',
                    'description' => 'Both parties agree that this contract is not a final sales contract. It does not transfer ownership of the property until the entire price of the property is paid by the first party, the final sales contract is concluded before the Notaire, and all legal formalities and conditions are met.',
                ],
                'ARTICLE 3' => [
                    'title' => 'ARTICLE 3',
                    'description' => 'The first party acknowledges that it reserves the right of the second party to acquire a commercial property in the housing project named {projectName}, according to the following specifications:<br>'.
                                     "<ul style='margin-top: 5px;'>".
                                     '<li><u>Approximate area</u> : {area}m² (area communicated by the architect according to the construction plan, the final area will be determined later by the land registry administration).</li>'.
                                     '<li><u>View</u> : Commercial property with 3 facades</li>'.
                                     '<li><u>Commercial Property No.</u> : {projectName} {propertyName}</li>'.
                                     '<li><u>State of the commercial property as agreed</u> : finished/standard</li>'.
                                     '<li><u>Mother title deed</u> : 55f/888888</li>'.
                                     '<li><u>Subsoil</u> :'.
                                     '  <ul>'.
                                     '      <li><u>Subsoil parking</u> : 5-P-5</li>'.
                                     '      <li><u>Price</u> : 0,00</li>'.
                                     '  </ul>'.
                                     '</li>'.
                                     '</ul>',
                ],
                'ARTICLE 4' => [
                    'title' => 'ARTICLE 4',
                    'description' => 'The second party pays to the first party an advance of 5,000.00 DH, in exchange for a detailed receipt as the sole proof of payment, within a period not exceeding 10 days from the date of signing this contract.',
                ],
                'ARTICLE 5' => [
                    'title' => 'ARTICLE 5',
                    'description' => 'Both parties agree on the final price of the commercial property, which is: {price} DH, paid by the second party to the first party in installments from the date of the first advance until the completion of construction and finishing work, at an installment rate of 80,000.00 DH every 1 month, starting from the date of signing this contract.',
                ],
                'ARTICLE 6' => [
                    'title' => 'ARTICLE 6',
                    'description' => 'In case of late payment of the installments specified in Article 5, the first party has the right to send a written warning to the address specified by the second party.',
                ],
                'ARTICLE 7' => [
                    'title' => 'ARTICLE 7',
                    'description' => 'The first party sets a maximum period of 15 days in its letter addressed to the second party starting from the delivery date.',
                ],
                'ARTICLE 8' => [
                    'title' => 'ARTICLE 8',
                    'description' => 'The second party agrees that the address chosen by them in this contract represents their true residence, and that they assume full responsibility in case of return of the mail specified in Article 7 for any reason whatsoever.',
                ],
                'ARTICLE 9' => [
                    'title' => 'ARTICLE 9',
                    'description' => 'The first party undertakes, upon expiration of the 15-day period specified in the mail sent to the second party, to refund the advance amount and the sum of installments paid by the second party without any deduction, damages, or penalties, and after retrieving all payment receipts issued by the first party. The latter also undertakes to do the same in case of delivery of the property in structural shell stage after expiration of the 90-day period for the second party to complete the finishing works.',
                ],
                'ARTICLE 10' => [
                    'title' => 'ARTICLE 10',
                    'description' => 'After expiration of the periods specified in this contract, the property will be at the disposal of the first party.',
                ],
                'ARTICLE 11' => [
                    'title' => 'ARTICLE 11',
                    'description' => 'The second party does not have the right to request any compensation amicably or legally after expiration of the periods specified in Articles 7 and 9, except the refund of funds already paid to the first party.',
                ],
                'ARTICLE 12' => [
                    'title' => 'ARTICLE 12',
                    'description' => 'In case of dispute, both parties agree to submit this contract to the provisions of the second paragraph of Article 114 of the Law of Contracts and Obligations.',
                ],
                'ARTICLE FINAL' => [
                    'title' => 'FINAL ARTICLE',
                    'description' => 'This agreement is a customary contract that binds both parties and preserves their rights at the time of signing without the obligation to legalize signatures, pending the drafting of the final sales contract under the provisions and formalities specified by Moroccan law.',
                ],
            ],
            'ar' => [
                'ARTICLE 1' => [
                    'title' => 'البند 1',
                    'description' => 'يقر الطرفان بالتعاقد والتصرف وفقاً للقواعد القانونية، دون تدليس وبحسن نية.',
                ],
                'ARTICLE 2' => [
                    'title' => 'البند 2',
                    'description' => 'اتفق الطرفان على أن هذا العقد ليس عقد بيع نهائي. ولا ينقل ملكية العقار إلا بعد أداء كامل ثمن العقار من طرف الطرف الأول وإبرام عقد البيع النهائي لدى الموثق واستيفاء جميع الإجراءات والشروط القانونية.',
                ],
                'ARTICLE 3' => [
                    'title' => 'البند 3',
                    'description' => 'يقر الطرف الأول بأنه يحتفظ بحق الطرف الثاني في اقتناء محل تجاري في المشروع السكني المسمى {projectName}، وفقاً للمواصفات التالية :<br>'.
                                     "<ul style='margin-top: 5px;'>".
                                     '<li><u>المساحة التقريبية</u> : {area} متر مربع (المساحة المحددة من طرف المهندس المعماري وفقاً لتصميم البناء، وسيتم تحديد المساحة النهائية لاحقاً من طرف إدارة المحافظة العقارية).</li>'.
                                     '<li><u>الإطلالة</u> : محل تجاري بـ 3 واجهات</li>'.
                                     '<li><u>رقم المحل التجاري</u> : {projectName} {propertyName}</li>'.
                                     '<li><u>حالة المحل التجاري وفقاً للاتفاق</u> : منتهى التشطيب</li>'.
                                     '<li><u>الرسم العقاري الأم</u> : 55f/888888</li>'.
                                     '<li><u>الطابق تحت الأرضي</u> :'.
                                     '  <ul>'.
                                     '      <li><u>مكان المرآب</u> : 5-P-5</li>'.
                                     '      <li><u>الثمن</u> : 0,00</li>'.
                                     '  </ul>'.
                                     '</li>'.
                                     '</ul>',
                ],
                'ARTICLE 4' => [
                    'title' => 'البند 4',
                    'description' => 'يؤدي الطرف الثاني للطرف الأول تسبيقاً قدره 5,000.00 درهم، مقابل إيصال مفصل كدليل وحيد على الأداء، وذلك في أجل لا يتعدى 10 أيام من تاريخ توقيع هذا العقد.',
                ],
                'ARTICLE 5' => [
                    'title' => 'البند 5',
                    'description' => 'اتفق الطرفان على الثمن النهائي للمحل التجاري وهو: {price} درهم، يؤديه الطرف الثاني لفائدة الطرف الأول في شكل أقساط أقربها من تاريخ التسبيق الأول وحتى انتهاء أشغال البناء والتشطيب، وذلك بقسط قدره 80,000.00 درهم كل شهر، ابتداءً من تاريخ توقيع هذا العقد.',
                ],
                'ARTICLE 6' => [
                    'title' => 'البند 6',
                    'description' => 'في حالة التأخر في أداء الأقساط المحددة في البند 5، يحق للطرف الأول إرسال إنذار كتابي إلى العنوان المحدد من طرف الطرف الثاني.',
                ],
                'ARTICLE 7' => [
                    'title' => 'البند 7',
                    'description' => 'يحدد الطرف الأول مهلة أقصاها 15 يوماً في رسالته الموجهة إلى الطرف الثاني ابتداءً من تاريخ التوصل.',
                ],
                'ARTICLE 8' => [
                    'title' => 'البند 8',
                    'description' => 'يوافق الطرف الثاني على أن العنوان المختار من طرفه في هذا العقد يمثل موطنه الحقيقي، وأنه يتحمل المسؤولية الكاملة في حالة رجوع البريد المحدد في البند 7 لأي سبب من الأسباب.',
                ],
                'ARTICLE 9' => [
                    'title' => 'البند 9',
                    'description' => 'يتعهد الطرف الأول في حالة انصرام أجل 15 يوماً المحدد في البريد الموجه للطرف الثاني، بإرجاع مبلغ التسبيق ومجموع الأقساط المؤداة من طرف الطرف الثاني دون أي اقتطاع أو تعويض أو غرامة، وذلك بعد استعادة جميع إيصالات الدفع الصادرة عن الطرف الأول. ويتعهد هذا الأخير أيضاً بالقيام بنفس الأمر في حالة تسليم العقار في حالة الأشغال الكبرى بعد انصرام أجل 90 يوماً ليقوم الطرف الثاني بإنهاء أشغال التشطيب.',
                ],
                'ARTICLE 10' => [
                    'title' => 'البند 10',
                    'description' => 'بعد انصرام الآجال المحددة في هذا العقد، يصبح العقار تحت تصرف الطرف الأول.',
                ],
                'ARTICLE 11' => [
                    'title' => 'البند 11',
                    'description' => 'لا يحق للطرف الثاني المطالبة بأي تعويض ودياً أو قضائياً بعد انصرام الآجال المحددة في البندين 7 و9، باستثناء استرداد المبالغ المؤداة بالفعل لفائدة الطرف الأول.',
                ],
                'ARTICLE 12' => [
                    'title' => 'البند 12',
                    'description' => 'في حالة النزاع، يتفق الطرفان على إخضاع هذا العقد لأحكام الفقرة الثانية من المادة 114 من قانون الالتزامات والعقود.',
                ],
                'ARTICLE FINAL' => [
                    'title' => 'البند الأخير',
                    'description' => 'يعتبر هذا العقد عقداً عرفياً يلزم الطرفين ويحفظ حقوقهما وقت التوقيع دون إلزامية تصديق التوقيعات، في انتظار تحرير عقد البيع النهائي بموجب الأحكام والإجراءات التي يحددها القانون المغربي.',
                ],
            ],
        ];

        return $articles->map(function ($article) use ($projectName, $propertyName, $area, $price, $lang, $translations) {
            $key = strtoupper(trim($article->title));
            $title = $article->title;
            $rawDescription = $article->description;

            if (isset($translations[$lang][$key])) {
                $title = $translations[$lang][$key]['title'];
                $rawDescription = $translations[$lang][$key]['description'];
            }

            $description = str_replace(
                ['{projectName}', '{propertyName}', '{area}', '{price}'],
                [$projectName, $propertyName, $area, $price],
                $rawDescription
            );

            return [
                'title' => $title,
                'description' => $description,
            ];
        })->toArray();
    }
}
