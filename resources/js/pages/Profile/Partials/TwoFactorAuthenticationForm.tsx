import InputError from '@/components/InputError';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TwoFactorAuthenticationForm({
    className = '',
}: {
    className?: string;
}) {
    const { props } = usePage();
    const user = props.auth.user;
    
    // Typecast flash data
    const flash = (props.flash || {}) as {
        two_factor_secret?: string | null;
        two_factor_qr_url?: string | null;
        two_factor_recovery_codes?: string[] | null;
    };

    const [confirmingPasswordFor, setConfirmingPasswordFor] = useState<'enable' | 'disable' | 'show-recovery' | 'regenerate' | null>(null);
    const [showingRecoveryCodes, setShowingRecoveryCodes] = useState(false);
    
    const passwordInput = useRef<HTMLInputElement>(null);
    const codeInput = useRef<HTMLInputElement>(null);

    // Form for password confirmation modal
    const passwordForm = useForm({
        password: '',
    });

    // Form for verifying TOTP code
    const confirmationForm = useForm({
        code: '',
    });

    // Automatically hide/show recovery codes when flash updates
    useEffect(() => {
        if (flash.two_factor_recovery_codes) {
            setShowingRecoveryCodes(true);
        }
    }, [flash.two_factor_recovery_codes]);

    const openPasswordModal = (action: 'enable' | 'disable' | 'show-recovery' | 'regenerate') => {
        setConfirmingPasswordFor(action);
        passwordForm.reset();
        passwordForm.clearErrors();
        setTimeout(() => passwordInput.current?.focus(), 150);
    };

    const closePasswordModal = () => {
        setConfirmingPasswordFor(null);
        passwordForm.reset();
        passwordForm.clearErrors();
    };

    // Submitting password to execute the action
    const submitPasswordForm: FormEventHandler = (e) => {
        e.preventDefault();

        if (confirmingPasswordFor === 'enable') {
            passwordForm.post(route('two-factor.enable'), {
                preserveScroll: true,
                onSuccess: () => closePasswordModal(),
                onError: () => passwordInput.current?.focus(),
            });
        } else if (confirmingPasswordFor === 'disable') {
            passwordForm.delete(route('two-factor.disable'), {
                preserveScroll: true,
                onSuccess: () => {
                    closePasswordModal();
                    setShowingRecoveryCodes(false);
                    confirmationForm.reset();
                },
                onError: () => passwordInput.current?.focus(),
            });
        } else if (confirmingPasswordFor === 'show-recovery') {
            passwordForm.post(route('two-factor.recovery-codes'), {
                preserveScroll: true,
                onSuccess: () => {
                    closePasswordModal();
                    setShowingRecoveryCodes(true);
                },
                onError: () => passwordInput.current?.focus(),
            });
        } else if (confirmingPasswordFor === 'regenerate') {
            passwordForm.post(route('two-factor.regenerate-recovery-codes'), {
                preserveScroll: true,
                onSuccess: () => {
                    closePasswordModal();
                    setShowingRecoveryCodes(true);
                },
                onError: () => passwordInput.current?.focus(),
            });
        }
    };

    // Confirming TOTP setup
    const confirmTwoFactorAuthentication: FormEventHandler = (e) => {
        e.preventDefault();

        confirmationForm.post(route('two-factor.confirm'), {
            preserveScroll: true,
            onSuccess: () => {
                confirmationForm.reset();
            },
            onError: () => codeInput.current?.focus(),
        });
    };

    const isEnabled = user.two_factor_confirmed_at !== null;
    const isPending = !isEnabled && !!flash.two_factor_secret;

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="space-y-1.5">
                <h3 className="font-display text-lg font-bold text-foreground">
                    Authentification à deux facteurs (MFA/2FA)
                </h3>
                <p className="text-sm text-muted-foreground">
                    Ajoutez une couche de sécurité supplémentaire à votre compte en utilisant l'authentification à deux facteurs.
                </p>
            </header>

            {isEnabled ? (
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                        L'authentification à deux facteurs est active et sécurise votre compte.
                    </div>

                    <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
                        Lorsque l'authentification à deux facteurs est activée, un jeton sécurisé aléatoire (OTP) vous sera demandé lors de la connexion. Vous pouvez obtenir ce jeton depuis l'application Google Authenticator, Authy ou Microsoft Authenticator de votre smartphone.
                    </p>

                    {showingRecoveryCodes && flash.two_factor_recovery_codes ? (
                        <div className="space-y-4 max-w-xl rounded-lg border border-border bg-muted/30 p-6">
                            <p className="text-sm font-semibold text-foreground">
                                Conservez ces codes de récupération dans un gestionnaire de mots de passe sécurisé. Ils peuvent être utilisés pour récupérer l'accès à votre compte si vous perdez votre appareil d'authentification.
                            </p>

                            <div className="grid grid-cols-1 gap-2 font-mono text-sm sm:grid-cols-2 text-foreground">
                                {flash.two_factor_recovery_codes.map((code) => (
                                    <div key={code} className="bg-background px-3 py-2 rounded-lg border border-border shadow-sm text-center font-bold font-mono tracking-wider select-all">
                                        {code}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button variant="outline" onClick={() => openPasswordModal('regenerate')} disabled={passwordForm.processing}>
                                    Régénérer les codes
                                </Button>
                                <Button variant="ghost" onClick={() => setShowingRecoveryCodes(false)}>
                                    Masquer les codes
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            <Button 
                                onClick={() => openPasswordModal('show-recovery')} 
                                disabled={passwordForm.processing}
                                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                                className="font-semibold"
                            >
                                Afficher les codes de récupération
                            </Button>
                            <Button variant="destructive" onClick={() => openPasswordModal('disable')} disabled={passwordForm.processing} className="font-semibold">
                                Désactiver la double authentification
                            </Button>
                        </div>
                    )}
                </div>
            ) : isPending ? (
                <div className="space-y-6 max-w-xl rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                    <div>
                        <h4 className="text-md font-bold text-amber-700 dark:text-amber-400">
                            Finaliser l'activation de l'authentification à deux facteurs
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            Pour terminer l'activation, scannez le code QR ci-dessous avec votre application d'authentification ou saisissez la clé de configuration, puis fournissez le code de validation généré.
                        </p>
                    </div>

                    {flash.two_factor_qr_url && (
                        <div className="space-y-4">
                            <div className="flex justify-start">
                                <div className="inline-block bg-white p-4 rounded-lg shadow-md border border-border">
                                    <QRCodeSVG value={flash.two_factor_qr_url} size={180} />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Clé de configuration (Setup Key) :
                                </span>
                                <code className="block bg-background px-3 py-3 rounded-lg font-mono text-sm border border-border shadow-inner select-all text-foreground font-bold tracking-widest text-center">
                                    {flash.two_factor_secret}
                                </code>
                            </div>
                        </div>
                    )}

                    <form onSubmit={confirmTwoFactorAuthentication} className="mt-4 space-y-4">
                        <div className="max-w-xs space-y-2">
                            <Label htmlFor="code">Code de vérification</Label>
                            <Input
                                id="code"
                                type="text"
                                name="code"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                ref={codeInput}
                                value={confirmationForm.data.code}
                                onChange={(e) => confirmationForm.setData('code', e.target.value)}
                                className="tracking-[0.5em] text-center text-lg font-bold h-12"
                                autoComplete="one-time-code"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                            <InputError message={confirmationForm.errors.code} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button 
                                type="submit" 
                                disabled={confirmationForm.processing}
                                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                                className="font-semibold"
                            >
                                {confirmationForm.processing ? 'Vérification...' : 'Confirmer'}
                            </Button>
                            <Button variant="outline" type="button" onClick={() => openPasswordModal('disable')} disabled={passwordForm.processing}>
                                Annuler l'activation
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-border">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        L'authentification à deux facteurs est actuellement désactivée.
                    </div>

                    <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
                        Lorsque l'authentification à deux facteurs est activée, un jeton sécurisé aléatoire (OTP) vous sera demandé lors de la connexion. Vous pouvez obtenir ce jeton depuis l'application Google Authenticator, Authy ou Microsoft Authenticator de votre smartphone.
                    </p>

                    <div>
                        <Button 
                            onClick={() => openPasswordModal('enable')} 
                            disabled={passwordForm.processing}
                            style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                            className="font-semibold"
                        >
                            Activer l'authentification à deux facteurs
                        </Button>
                    </div>
                </div>
            )}

            {/* Password Confirmation Dialog */}
            <Dialog open={confirmingPasswordFor !== null} onOpenChange={(open) => !open && closePasswordModal()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display text-lg font-bold text-foreground">
                            Confirmer votre mot de passe
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Par mesure de sécurité, veuillez confirmer votre mot de passe pour continuer.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitPasswordForm} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Mot de passe</Label>
                            <Input
                                id="confirm_password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                placeholder="Saisissez votre mot de passe"
                                required
                            />
                            <InputError message={passwordForm.errors.password} />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={closePasswordModal} disabled={passwordForm.processing}>
                                Annuler
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={passwordForm.processing}
                                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                                className="font-semibold"
                            >
                                Confirmer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
