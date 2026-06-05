import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { File, Download, Trash2, Plus, FolderPlus, FileText, FileSpreadsheet, Image as ImageIcon, ChevronRight, FileVideo, FileAudio, FileArchive } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

export default function Index({ bloc, documents, categories }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast({ title: "Succès", description: flash.success });
        if (flash?.error) toast({ title: "Erreur", description: flash.error, variant: "destructive" });
    }, [flash]);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

    const { data, setData, post, progress, processing, errors, reset, clearErrors } = useForm({
        name: '',
        document_category_id: '',
        file: null as File | null,
    });

    const categoryForm = useForm({
        name: '',
    });

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.file && data.file.size > 10 * 1024 * 1024) {
            toast({ title: "Erreur", description: "Le fichier est trop volumineux. La taille maximale autorisée est de 10 Mo.", variant: "destructive" });
            return;
        }

        post(route('blocs.documents.store', bloc.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                reset();
                clearErrors();
            },
        });
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        categoryForm.post(route('document-categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                categoryForm.reset();
                categoryForm.clearErrors();
            },
        });
    };

    const deleteCategory = (id: number) => {
        router.delete(route('document-categories.destroy', id), {
            preserveScroll: true,
        });
    };

    const confirmDeleteDocument = () => {
        if (documentToDelete) {
            router.delete(route('documents.destroy', documentToDelete), {
                preserveScroll: true,
                onSuccess: () => setDocumentToDelete(null),
            });
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const getFileIcon = (extension: string) => {
        const ext = extension?.toLowerCase();
        if (['pdf'].includes(ext)) return <FileText className="w-5 h-5 text-rose-500" />;
        if (['doc', 'docx'].includes(ext)) return <FileText className="w-5 h-5 text-blue-500" />;
        if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <ImageIcon className="w-5 h-5 text-purple-500" />;
        if (['mp4', 'avi', 'mov'].includes(ext)) return <FileVideo className="w-5 h-5 text-amber-500" />;
        if (['mp3', 'wav'].includes(ext)) return <FileAudio className="w-5 h-5 text-teal-500" />;
        if (['zip', 'rar', '7z', 'tar'].includes(ext)) return <FileArchive className="w-5 h-5 text-slate-500" />;
        return <File className="w-5 h-5 text-muted-foreground" />;
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <SidebarTrigger className="lg:hidden flex-shrink-0" />
                            <div className="truncate">
                                <AppBreadcrumb />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="hidden sm:flex gap-2 bg-card border-border hover:bg-accent/10"
                            >
                                <FolderPlus className="w-4 h-4" />
                                Catégories
                            </Button>
                            <Button 
                                onClick={() => setIsUploadModalOpen(true)}
                                className="gap-2 shadow-sm font-semibold border-0"
                                style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}
                            >
                                <Plus className="w-4 h-4" />
                                Nouveau Document
                            </Button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
                        <Head title={`Documents - ${bloc.name}`} />

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Documents</h2>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500">
                                        {bloc.name}
                                    </span>
                                </div>
                                <p className="text-[0.9375rem] text-muted-foreground">
                                    Gérez et stockez les documents rattachés à ce bloc ({bloc.tranche?.project?.name} - {bloc.tranche?.name}).
                                </p>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                            {documents.length === 0 ? (
                                <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                                        <File className="w-10 h-10 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="font-display text-xl font-bold mb-2">Aucun document</h3>
                                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Commencez par ajouter le premier document pour ce bloc.</p>
                                    <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2 shadow-sm">
                                        <Plus className="w-4 h-4" /> Ajouter un document
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[40%]">Document</TableHead>
                                            <TableHead>Catégorie</TableHead>
                                            <TableHead>Taille</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.map((doc: any) => (
                                            <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                                            {getFileIcon(doc.extension)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold text-foreground truncate">{doc.name}</div>
                                                            <div className="text-xs text-muted-foreground uppercase mt-0.5">{doc.extension}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                                        {doc.category?.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatBytes(doc.file_size)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(doc.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a href={route('documents.download', doc.id)} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => setDocumentToDelete(doc.id)}
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl font-bold">Nouveau Document</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUploadSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du document</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Ex: Plan d'architecte"
                                className={errors.name ? "border-destructive ring-destructive/20" : ""}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <Select 
                                value={data.document_category_id} 
                                onValueChange={value => setData('document_category_id', value)}
                            >
                                <SelectTrigger className={errors.document_category_id ? "border-destructive ring-destructive/20" : ""}>
                                    <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.document_category_id && <p className="text-xs text-destructive">{errors.document_category_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file">Fichier</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                className={errors.file ? "border-destructive ring-destructive/20 cursor-pointer text-muted-foreground file:mr-4 file:bg-muted file:text-foreground file:border-0 file:rounded-md hover:file:bg-muted/80" : "cursor-pointer text-muted-foreground file:mr-4 file:bg-muted file:text-foreground file:border-0 file:rounded-md hover:file:bg-muted/80"}
                            />
                            <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, JPG, PNG (Max: 10MB)</p>
                            {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                        </div>
                        
                        {progress && (
                            <div className="space-y-1 pt-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Téléchargement...</span>
                                    <span>{progress.percentage}%</span>
                                </div>
                                <Progress value={progress.percentage} className="h-2" />
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-border mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)} disabled={processing}>Annuler</Button>
                            <Button type="submit" disabled={processing || !data.file} className="shadow-sm">
                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Category Manager Dialog */}
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl font-bold">Catégories de Documents</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        <form onSubmit={handleCategorySubmit} className="flex gap-2 items-end">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="new-category">Nouvelle catégorie</Label>
                                <Input
                                    id="new-category"
                                    value={categoryForm.data.name}
                                    onChange={e => categoryForm.setData('name', e.target.value)}
                                    placeholder="Ex: Factures"
                                    className={categoryForm.errors.name ? "border-destructive ring-destructive/20" : ""}
                                />
                            </div>
                            <Button type="submit" disabled={categoryForm.processing || !categoryForm.data.name} variant="secondary">
                                Ajouter
                            </Button>
                        </form>
                        {categoryForm.errors.name && <p className="text-xs text-destructive -mt-4">{categoryForm.errors.name}</p>}

                        <div className="space-y-3">
                            <Label>Catégories existantes</Label>
                            <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                                {categories.length === 0 ? (
                                    <p className="p-4 text-sm text-muted-foreground text-center">Aucune catégorie.</p>
                                ) : (
                                    <ul className="divide-y divide-border max-h-[40vh] overflow-y-auto">
                                        {categories.map((cat: any) => (
                                            <li key={cat.id} className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                                                <span className="text-sm font-medium">{cat.name}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => deleteCategory(cat.id)}
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    title="Supprimer la catégorie"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={documentToDelete !== null} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
                <AlertDialogContent className="border-border/60 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-display text-xl font-bold">Supprimer le document ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le document sera définitivement effacé du serveur.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-4">
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDeleteDocument}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarProvider>
    );
}
