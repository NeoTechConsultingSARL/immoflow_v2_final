import React, { useEffect, useMemo, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

function getHierarchyFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        companyId: searchParams.get('company') || '',
        companyName: searchParams.get('companyName') || '',
        projectId: searchParams.get('project') || '',
        projectName: searchParams.get('name') || '',
        trancheId: searchParams.get('tranche') || '',
        trancheName: searchParams.get('trancheName') || '',
        blocId: searchParams.get('bloc_id') || searchParams.get('bloc') || '',
        blocName: searchParams.get('blocName') || '',
        blocParam: searchParams.get('bloc') || '',
    };
}

function findHierarchyForBloc(projects: any[], blocId: string) {
    for (const project of projects) {
        for (const tranche of project.tranches || []) {
            for (const bloc of tranche.blocs || []) {
                if (bloc.id.toString() === blocId) {
                    return {
                        projectId: project.id.toString(),
                        projectName: project.name,
                        trancheId: tranche.id.toString(),
                        trancheName: tranche.name,
                        blocId: bloc.id.toString(),
                        blocName: bloc.name,
                    };
                }
            }
        }
    }
    return null;
}

function buildSyndicQueryParams(params: {
    companyId?: string;
    companyName?: string;
    projectId?: string;
    projectName?: string;
    trancheId?: string;
    trancheName?: string;
    blocId?: string;
    blocName?: string;
}) {
    const query: Record<string, string> = {};
    if (params.companyId) {
        query.company = params.companyId;
        query.companyName = params.companyName || '';
    }
    if (params.projectId) {
        query.project = params.projectId;
        query.name = params.projectName || '';
    }
    if (params.trancheId) {
        query.tranche = params.trancheId;
        query.trancheName = params.trancheName || '';
    }
    if (params.blocId) {
        query.bloc = params.blocId;
        query.blocName = params.blocName || '';
        query.bloc_id = params.blocId;
    }
    return query;
}

function resolveInitialSelection(projects: any[], selectedBlocId: string) {
    const urlHierarchy = getHierarchyFromUrl();
    let projectId = urlHierarchy.projectId;
    let trancheId = urlHierarchy.trancheId;
    let blocId = urlHierarchy.blocId || selectedBlocId;

    if (blocId && (!projectId || !trancheId)) {
        const resolved = findHierarchyForBloc(projects, blocId);
        if (resolved) {
            projectId = resolved.projectId;
            trancheId = resolved.trancheId;
        }
    }

    return { projectId, trancheId, blocId };
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { toast } from "@/hooks/use-toast";
import { Plus, Printer, Edit2, Trash2 } from "lucide-react";

interface SyndicPageProps {
    projects: any[];
    syndics: any[];
    charges: any[];
    clients: any[];
    chargeTypes: any[];
    total_payments_client: number;
    total_charges: number;
    solde: number;
    selected_bloc_id?: string;
}

export default function SyndicIndex({
    projects = [],
    syndics = [],
    charges = [],
    clients = [],
    chargeTypes = [],
    total_payments_client = 0,
    total_charges = 0,
    solde = 0,
    selected_bloc_id = '',
}: SyndicPageProps) {
    const normalizedSelectedBlocId = selected_bloc_id ? String(selected_bloc_id) : '';
    const totalPaymentsValue = Number(total_payments_client || 0);
    const totalChargesValue = Number(total_charges || 0);
    const soldeValue = Number(solde || 0);

    const initialSelection = resolveInitialSelection(projects, normalizedSelectedBlocId);
    const [selectedProject, setSelectedProject] = useState<string>(initialSelection.projectId);
    const [selectedTranche, setSelectedTranche] = useState<string>(initialSelection.trancheId);
    const [selectedBloc, setSelectedBloc] = useState<string>(initialSelection.blocId);
    const [clientQuery, setClientQuery] = useState('');
    const [clientOptions, setClientOptions] = useState<any[]>(clients);

    // Dialog states
    const [openPaiement, setOpenPaiement] = useState(false);
    const [openCharge, setOpenCharge] = useState(false);
    const [openChargeType, setOpenChargeType] = useState(false);

    // Status change modal states
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedSyndicId, setSelectedSyndicId] = useState<number | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>('');
    
    const [editingSyndicId, setEditingSyndicId] = useState<number | null>(null);
    const [editingChargeId, setEditingChargeId] = useState<number | null>(null);

    // Form for Paiement
    const paiementForm = useForm({
        client_id: '',
        date: new Date().toISOString().split('T')[0],
        montant: '',
        bloc_id: normalizedSelectedBlocId
    });

    // Form for Charge
    const chargeForm = useForm({
        syndic_charge_type_id: '',
        date_operation: new Date().toISOString().split('T')[0],
        montant: '',
        designation: '',
        societe: '',
        bloc_id: normalizedSelectedBlocId
    });

    // Form for Charge Type
    const chargeTypeForm = useForm({
        nom: ''
    });

    const tranches = useMemo(() => {
        if (!selectedProject) return [];
        const project = projects.find(p => p.id.toString() === selectedProject);
        return project?.tranches || [];
    }, [selectedProject, projects]);

    const blocs = useMemo(() => {
        if (!selectedTranche) return [];
        const tranche = tranches.find((t: any) => t.id.toString() === selectedTranche);
        return tranche?.blocs || [];
    }, [selectedTranche, tranches]);

    const handleProjectChange = (val: string) => {
        const project = projects.find(p => p.id.toString() === val);
        const urlHierarchy = getHierarchyFromUrl();

        setSelectedProject(val);
        setSelectedTranche('');
        setSelectedBloc('');
        paiementForm.setData('bloc_id', '');
        chargeForm.setData('bloc_id', '');

        router.get(
            route('syndic.index'),
            buildSyndicQueryParams({
                companyId: urlHierarchy.companyId,
                companyName: urlHierarchy.companyName,
                projectId: val,
                projectName: project?.name || '',
            }),
            { preserveState: true, replace: true },
        );
    };

    const handleTrancheChange = (val: string) => {
        const project = projects.find(p => p.id.toString() === selectedProject);
        const tranche = project?.tranches?.find((t: any) => t.id.toString() === val);
        const urlHierarchy = getHierarchyFromUrl();

        setSelectedTranche(val);
        setSelectedBloc('');
        paiementForm.setData('bloc_id', '');
        chargeForm.setData('bloc_id', '');

        router.get(
            route('syndic.index'),
            buildSyndicQueryParams({
                companyId: urlHierarchy.companyId,
                companyName: urlHierarchy.companyName,
                projectId: selectedProject,
                projectName: project?.name || urlHierarchy.projectName,
                trancheId: val,
                trancheName: tranche?.name || '',
            }),
            { preserveState: true, replace: true },
        );
    };

    const handleBlocChange = (val: string) => {
        const project = projects.find(p => p.id.toString() === selectedProject);
        const tranche = project?.tranches?.find((t: any) => t.id.toString() === selectedTranche);
        const bloc = tranche?.blocs?.find((b: any) => b.id.toString() === val);
        const urlHierarchy = getHierarchyFromUrl();

        setSelectedBloc(val);
        paiementForm.setData('bloc_id', val);
        chargeForm.setData('bloc_id', val);

        router.get(
            route('syndic.index'),
            buildSyndicQueryParams({
                companyId: urlHierarchy.companyId,
                companyName: urlHierarchy.companyName,
                projectId: selectedProject,
                projectName: project?.name || urlHierarchy.projectName,
                trancheId: selectedTranche,
                trancheName: tranche?.name || urlHierarchy.trancheName,
                blocId: val,
                blocName: bloc?.name || '',
            }),
            { preserveState: true },
        );
    };

    const submitPaiement = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSyndicId) {
            paiementForm.put(route('syndic.update', editingSyndicId), {
                onSuccess: () => {
                    setOpenPaiement(false);
                    setEditingSyndicId(null);
                    paiementForm.reset();
                    paiementForm.setData('bloc_id', selectedBloc);
                    setClientQuery('');
                    toast({ title: "Paiement mis à jour avec succès" });
                },
            });
        } else {
            paiementForm.post(route('syndic.store'), {
                onSuccess: () => {
                    setOpenPaiement(false);
                    paiementForm.reset();
                    paiementForm.setData('bloc_id', selectedBloc);
                    setClientQuery('');
                    toast({ title: "Paiement ajouté avec succès" });
                },
            });
        }
    };

    const submitCharge = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingChargeId) {
            chargeForm.put(route('syndic-charges.update', editingChargeId), {
                onSuccess: () => {
                    setOpenCharge(false);
                    setEditingChargeId(null);
                    chargeForm.reset();
                    chargeForm.setData('bloc_id', selectedBloc);
                    toast({ title: "Charge mise à jour avec succès" });
                },
            });
        } else {
            chargeForm.post(route('syndic-charges.store'), {
                onSuccess: () => {
                    setOpenCharge(false);
                    chargeForm.reset();
                    chargeForm.setData('bloc_id', selectedBloc);
                    toast({ title: "Charge ajoutée avec succès" });
                },
            });
        }
    };

    const handleOpenPaiementChange = (open: boolean) => {
        setOpenPaiement(open);
        if (!open) {
            setEditingSyndicId(null);
            paiementForm.reset();
            paiementForm.setData('bloc_id', selectedBloc);
            setClientQuery('');
            paiementForm.clearErrors();
        }
    };

    const handleOpenChargeChange = (open: boolean) => {
        setOpenCharge(open);
        if (!open) {
            setEditingChargeId(null);
            chargeForm.reset();
            chargeForm.setData('bloc_id', selectedBloc);
            chargeForm.clearErrors();
        }
    };

    const openEditPaiement = (s: any) => {
        setEditingSyndicId(s.id);
        paiementForm.setData({
            date: s.date,
            montant: s.montant,
            client_id: s.client_id,
            bloc_id: s.bloc_id
        });
        setClientQuery(s.client?.full_name || '');
        setOpenPaiement(true);
    };

    const handleDeletePaiement = (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
            router.delete(route('syndic.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast({ title: "Succès", description: "Paiement supprimé." })
            });
        }
    };

    const openEditCharge = (c: any) => {
        setEditingChargeId(c.id);
        chargeForm.setData({
            syndic_charge_type_id: c.syndic_charge_type_id.toString(),
            date_operation: c.date_operation,
            montant: c.montant,
            designation: c.designation || '',
            societe: c.societe || '',
            bloc_id: c.bloc_id
        });
        setOpenCharge(true);
    };

    const handleDeleteCharge = (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette charge ?")) {
            router.delete(route('syndic-charges.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast({ title: "Succès", description: "Charge supprimée." })
            });
        }
    };

    const submitChargeType = (e: React.FormEvent) => {
        e.preventDefault();
        chargeTypeForm.post(route('syndic-charge-types.store'), {
            onSuccess: () => {
                setOpenChargeType(false);
                chargeTypeForm.reset();
                toast({ title: "Type de charge ajouté avec succès" });
            },
        });
    };

    const handleStatusClick = (id: number, status: string) => {
        setSelectedSyndicId(id);
        setCurrentStatus(status);
        setStatusModalOpen(true);
    };

    const confirmStatusChange = () => {
        if (!selectedSyndicId) return;
        const newStatus = currentStatus === 'Valide' ? 'Non Valide' : 'Valide';
        router.patch(route('syndic.update-status', selectedSyndicId), { status: newStatus }, {
            onSuccess: () => {
                setStatusModalOpen(false);
                toast({ title: "Statut mis à jour avec succès" });
            },
            onError: () => {
                toast({ title: "Erreur de mise à jour", description: "Seul un administrateur peut modifier le statut.", variant: "destructive" });
            }
        });
    };

    const handlePrintBilan = () => {
        if (!selectedBloc) {
            toast({ title: "Veuillez sélectionner un bloc", variant: "destructive" });
            return;
        }
        window.open(route('syndic.bilan', { bloc_id: selectedBloc }), '_blank');
    };

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            try {
                const response = await fetch(route('syndic.clients.search', { q: clientQuery }), {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setClientOptions(Array.isArray(data) ? data : []);
            } catch {
                // Network cancel/errors are ignored intentionally for UX fluidity.
            }
        }, 250);

        return () => {
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [clientQuery]);

    useEffect(() => {
        setSelectedBloc(normalizedSelectedBlocId);
        paiementForm.setData('bloc_id', normalizedSelectedBlocId);
        chargeForm.setData('bloc_id', normalizedSelectedBlocId);
    }, [normalizedSelectedBlocId]);

    useEffect(() => {
        const urlHierarchy = getHierarchyFromUrl();
        const blocId = urlHierarchy.blocId || normalizedSelectedBlocId;

        if (!blocId) {
            return;
        }

        const needsUrlSync =
            !urlHierarchy.projectId ||
            !urlHierarchy.trancheId ||
            !urlHierarchy.blocParam ||
            urlHierarchy.blocId !== blocId;

        if (!needsUrlSync) {
            return;
        }

        const resolved = findHierarchyForBloc(projects, blocId);
        if (!resolved) {
            return;
        }

        router.get(
            route('syndic.index'),
            buildSyndicQueryParams({
                companyId: urlHierarchy.companyId,
                companyName: urlHierarchy.companyName,
                ...resolved,
            }),
            { preserveState: true, replace: true },
        );
    }, [normalizedSelectedBlocId, projects]);

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="lg:hidden" />
                            <AppBreadcrumb />
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
                        <Head title="Gestion Syndique" />

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Gestion Syndique</h2>
                                <p className="text-[0.9375rem] text-muted-foreground">Gérez les opérations, paiements et charges de syndic.</p>
                            </div>
                            {selectedBloc && (
                                <Button variant="outline" onClick={handlePrintBilan} className="gap-2 bg-card border-border hover:bg-accent/10">
                                    <Printer className="w-4 h-4" /> Bilan de syndique
                                </Button>
                            )}
                        </div>

                        {/* Cascading Filters */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Sélection de l'emplacement</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Projet</label>
                                    <Select value={selectedProject} onValueChange={handleProjectChange}>
                                        <SelectTrigger><SelectValue placeholder="Sélectionner un projet" /></SelectTrigger>
                                        <SelectContent>
                                            {projects.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Tranche</label>
                                    <Select value={selectedTranche} onValueChange={handleTrancheChange} disabled={!selectedProject}>
                                        <SelectTrigger><SelectValue placeholder="Sélectionner une tranche" /></SelectTrigger>
                                        <SelectContent>
                                            {tranches.map((t: any) => (
                                                <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Bloc</label>
                                    <Select value={selectedBloc} onValueChange={handleBlocChange} disabled={!selectedTranche}>
                                        <SelectTrigger><SelectValue placeholder="Sélectionner un bloc" /></SelectTrigger>
                                        <SelectContent>
                                            {blocs.map((b: any) => (
                                                <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {selectedBloc && (
                            <div className="space-y-6">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="shadow-[var(--shadow-card)] border-border">
                                        <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Paiements Clients</CardTitle></CardHeader>
                                        <CardContent><p className="text-2xl font-bold font-display text-foreground">{totalPaymentsValue.toFixed(2)} DH</p></CardContent>
                                    </Card>
                                    <Card className="shadow-[var(--shadow-card)] border-border">
                                        <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Charges Syndique</CardTitle></CardHeader>
                                        <CardContent><p className="text-2xl font-bold font-display text-foreground">{totalChargesValue.toFixed(2)} DH</p></CardContent>
                                    </Card>
                                    <Card className="shadow-[var(--shadow-card)] border-border">
                                        <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solde (Paiements - Charges)</CardTitle></CardHeader>
                                        <CardContent><p className={`text-2xl font-bold font-display ${soldeValue >= 0 ? 'text-foreground' : 'text-destructive'}`}>{soldeValue.toFixed(2)} DH</p></CardContent>
                                    </Card>
                                </div>

                                {/* Paiements Table */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8 mb-4">
                                    <div>
                                        <h3 className="font-display text-xl font-bold">Gestion Syndique (Paiements)</h3>
                                    </div>
                                    <Dialog open={openPaiement} onOpenChange={handleOpenPaiementChange}>
                                        <DialogTrigger asChild>
                                            <Button className="gap-2 shadow-sm font-semibold border-0" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}><Plus className="w-4 h-4" /> Syndique</Button>
                                        </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{editingSyndicId ? "Modifier le paiement" : "Ajouter Nouveau Paiement"}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={submitPaiement} className="space-y-4">
                                                    <div>
                                                        <Label>Client</Label>
                                                        <Input
                                                            placeholder="Rechercher client (nom/prenom)"
                                                            value={clientQuery}
                                                            onChange={(e) => setClientQuery(e.target.value)}
                                                            className="mb-2"
                                                        />
                                                        <Select value={paiementForm.data.client_id} onValueChange={(val) => paiementForm.setData('client_id', val)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner un client" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {clientOptions.map((c) => (
                                                                    <SelectItem key={c.id} value={c.id.toString()}>
                                                                        {c.full_name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {paiementForm.errors.client_id && <p className="text-sm text-red-500">{paiementForm.errors.client_id}</p>}
                                                    </div>
                                                    <div>
                                                        <Label>Date Opération</Label>
                                                        <Input type="date" value={paiementForm.data.date} onChange={e => paiementForm.setData('date', e.target.value)} />
                                                        {paiementForm.errors.date && <p className="text-sm text-red-500">{paiementForm.errors.date}</p>}
                                                    </div>
                                                    <div>
                                                        <Label>Montant</Label>
                                                        <Input type="number" step="0.01" value={paiementForm.data.montant} onChange={e => paiementForm.setData('montant', e.target.value)} />
                                                        {paiementForm.errors.montant && <p className="text-sm text-red-500">{paiementForm.errors.montant}</p>}
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" variant="outline" onClick={() => setOpenPaiement(false)}>Annuler</Button>
                                                        <Button type="submit" disabled={paiementForm.processing}>Sauvegarder</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                </div>
                                <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Client</TableHead>
                                                    <TableHead>Date Paiement</TableHead>
                                                    <TableHead>Montant</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {syndics.length === 0 ? (
                                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No data available in table</TableCell></TableRow>
                                                ) : (
                                                    syndics.map(s => (
                                                        <TableRow key={s.id}>
                                                            <TableCell className="font-medium">{s.client?.full_name}</TableCell>
                                                            <TableCell>{s.date}</TableCell>
                                                            <TableCell>{s.montant} DH</TableCell>
                                                            <TableCell>
                                                                <button onClick={() => handleStatusClick(s.id, s.status)} className="focus:outline-none hover:opacity-80 transition-opacity">
                                                                    <Badge variant={s.status === 'Valide' ? 'default' : 'secondary'} className="cursor-pointer">
                                                                        {s.status}
                                                                    </Badge>
                                                                </button>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="ghost" size="icon" onClick={() => openEditPaiement(s)}>
                                                                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeletePaiement(s.id)}>
                                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                </div>

                                {/* Charges Table */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8 mb-4">
                                    <div>
                                        <h3 className="font-display text-xl font-bold">Gestion des charges syndique</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog open={openChargeType} onOpenChange={setOpenChargeType}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="gap-2 bg-card border-border hover:bg-accent/10"><Plus className="w-4 h-4" /> Type Charge</Button>
                                            </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Ajouter Nouveau Type Charge</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={submitChargeType} className="space-y-4">
                                                        <div>
                                                            <Label>Nom Type Charge</Label>
                                                            <Input value={chargeTypeForm.data.nom} onChange={e => chargeTypeForm.setData('nom', e.target.value)} />
                                                            {chargeTypeForm.errors.nom && <p className="text-sm text-red-500">{chargeTypeForm.errors.nom}</p>}
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => setOpenChargeType(false)}>Annuler</Button>
                                                            <Button type="submit" disabled={chargeTypeForm.processing}>Sauvegarder</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog open={openCharge} onOpenChange={handleOpenChargeChange}>
                                                <DialogTrigger asChild>
                                                    <Button className="gap-2 shadow-sm font-semibold border-0" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}><Plus className="w-4 h-4" /> Charge</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>{editingChargeId ? "Modifier la charge" : "Ajouter une nouvelle charge"}</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={submitCharge} className="space-y-4">
                                                        <div>
                                                            <Label>Type Charge</Label>
                                                            <Select value={chargeForm.data.syndic_charge_type_id} onValueChange={(val) => chargeForm.setData('syndic_charge_type_id', val)}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner un type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {chargeTypes.map(ct => <SelectItem key={ct.id} value={ct.id.toString()}>{ct.nom}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            {chargeForm.errors.syndic_charge_type_id && <p className="text-sm text-red-500">{chargeForm.errors.syndic_charge_type_id}</p>}
                                                        </div>
                                                        <div>
                                                            <Label>Date Opération</Label>
                                                            <Input type="date" value={chargeForm.data.date_operation} onChange={e => chargeForm.setData('date_operation', e.target.value)} />
                                                            {chargeForm.errors.date_operation && <p className="text-sm text-red-500">{chargeForm.errors.date_operation}</p>}
                                                        </div>
                                                        <div>
                                                            <Label>Montant</Label>
                                                            <Input type="number" step="0.01" value={chargeForm.data.montant} onChange={e => chargeForm.setData('montant', e.target.value)} />
                                                            {chargeForm.errors.montant && <p className="text-sm text-red-500">{chargeForm.errors.montant}</p>}
                                                        </div>
                                                        <div>
                                                            <Label>Désignation</Label>
                                                            <Input value={chargeForm.data.designation} onChange={e => chargeForm.setData('designation', e.target.value)} />
                                                            {chargeForm.errors.designation && <p className="text-sm text-red-500">{chargeForm.errors.designation}</p>}
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => setOpenCharge(false)}>Annuler</Button>
                                                            <Button type="submit" disabled={chargeForm.processing}>Sauvegarder</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                </div>
                                <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>DateOp</TableHead>
                                                    <TableHead>Désignation</TableHead>
                                                    <TableHead>Montant</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {charges.length === 0 ? (
                                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No data available in table</TableCell></TableRow>
                                                ) : (
                                                    charges.map(c => (
                                                        <TableRow key={c.id}>
                                                            <TableCell className="font-medium">{c.syndic_charge_type?.nom}</TableCell>
                                                            <TableCell>{c.date_operation}</TableCell>
                                                            <TableCell>{c.designation || '-'}</TableCell>
                                                            <TableCell>{c.montant} DH</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="ghost" size="icon" onClick={() => openEditCharge(c)}>
                                                                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCharge(c.id)}>
                                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                </div>
                            </div>
                        )}

                        {/* Status Change Dialog */}
                        <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Changer le statut du paiement</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <p>Êtes-vous sûr de vouloir passer le statut à <strong>{currentStatus === 'Valide' ? 'Non Valide' : 'Valide'}</strong> ?</p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Annuler</Button>
                                    <Button onClick={confirmStatusChange} className="shadow-sm font-semibold border-0" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}>Confirmer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
