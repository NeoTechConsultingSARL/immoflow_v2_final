<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractArticleRequest;
use App\Http\Requests\UpdateContractArticleRequest;
use App\Models\ContractArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractArticleController extends Controller
{
    /**
     * Display a listing of contract articles.
     */
    public function index(): Response
    {
        $articles = ContractArticle::orderBy('article_order', 'asc')
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'description' => $article->description,
                    'article_order' => $article->article_order,
                    'status' => $article->status,
                ];
            });

        return Inertia::render('SettingsContractArticles', [
            'articles' => $articles,
        ]);
    }

    /**
     * Store a newly created contract article.
     */
    public function store(StoreContractArticleRequest $request): RedirectResponse
    {
        ContractArticle::create($request->validated());

        return redirect()
            ->route('settings.contract-articles.index')
            ->with('success', 'Contract article created successfully.');
    }

    /**
     * Update the specified contract article.
     */
    public function update(UpdateContractArticleRequest $request, ContractArticle $contractArticle): RedirectResponse
    {
        $contractArticle->update($request->validated());

        return redirect()
            ->route('settings.contract-articles.index')
            ->with('success', 'Contract article updated successfully.');
    }

    /**
     * Remove the specified contract article.
     */
    public function destroy(ContractArticle $contractArticle): RedirectResponse
    {
        $contractArticle->delete();

        return redirect()
            ->route('settings.contract-articles.index')
            ->with('success', 'Contract article deleted successfully.');
    }

    /**
     * Toggle the active status of a contract article.
     */
    public function toggleStatus(ContractArticle $contractArticle): RedirectResponse
    {
        $newStatus = $contractArticle->status === ContractArticle::STATUS_ACTIVE
            ? ContractArticle::STATUS_INACTIVE
            : ContractArticle::STATUS_ACTIVE;

        $contractArticle->update(['status' => $newStatus]);

        $message = $newStatus === ContractArticle::STATUS_ACTIVE
            ? 'Contract article activated successfully.'
            : 'Contract article deactivated successfully.';

        return redirect()
            ->route('settings.contract-articles.index')
            ->with('success', $message);
    }

    /**
     * Reorder the contract articles.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'orders' => ['required', 'array'],
            'orders.*.id' => ['required', 'integer', 'exists:contract_articles,id'],
            'orders.*.article_order' => ['required', 'integer'],
        ]);

        foreach ($request->input('orders') as $orderData) {
            ContractArticle::where('id', $orderData['id'])->update([
                'article_order' => $orderData['article_order'],
            ]);
        }

        return redirect()
            ->route('settings.contract-articles.index')
            ->with('success', 'Contract articles reordered successfully.');
    }
}
