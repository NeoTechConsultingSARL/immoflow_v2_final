import InputError from '@/components/InputError';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="space-y-1.5">
                <h3 className="font-display text-lg font-bold text-foreground">
                    Informations du profil
                </h3>
                <p className="text-sm text-muted-foreground">
                    Mettez à jour les informations de votre compte et votre adresse e-mail.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Votre nom"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="exemple@domaine.com"
                    />
                    <InputError message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                            Votre adresse e-mail n'est pas vérifiée.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-xs text-amber-700 dark:text-amber-300 underline font-semibold hover:text-amber-600 focus:outline-none"
                        >
                            Cliquez ici pour renvoyer l'e-mail de vérification.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                                Un nouveau lien de vérification a été envoyé à votre adresse e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <Button 
                        type="submit" 
                        disabled={processing}
                        style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                        className="px-6 font-semibold"
                    >
                        {processing ? "Enregistrement..." : "Enregistrer"}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            Enregistré avec succès.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
