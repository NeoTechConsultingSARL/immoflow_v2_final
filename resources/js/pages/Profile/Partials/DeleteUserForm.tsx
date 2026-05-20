import InputError from '@/components/InputError';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="space-y-1.5">
                <h3 className="font-display text-lg font-bold text-destructive">
                    Supprimer le compte
                </h3>
                <p className="text-sm text-muted-foreground">
                    Une fois votre compte supprimé, toutes ses ressources et données seront définitivement perdues. Veuillez télécharger toutes les données ou informations que vous souhaitez conserver avant de procéder.
                </p>
            </header>

            <Button variant="destructive" onClick={confirmUserDeletion} className="font-semibold">
                Supprimer le compte
            </Button>

            <Dialog open={confirmingUserDeletion} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display text-lg text-destructive font-bold">
                            Êtes-vous sûr de vouloir supprimer votre compte ?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Cette action est irréversible. Toutes vos données seront définitivement effacées. Veuillez saisir votre mot de passe pour confirmer cette action.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={deleteUser} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Saisissez votre mot de passe"
                                required
                            />
                            <InputError message={errors.password} />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={closeModal} disabled={processing}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="destructive" disabled={processing} className="font-semibold">
                                {processing ? "Suppression en cours..." : "Confirmer la suppression"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
