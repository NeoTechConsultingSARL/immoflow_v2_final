import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function TwoFactorChallenge() {
    const [recovery, setRecovery] = useState(false);
    
    const codeInput = useRef<HTMLInputElement>(null);
    const recoveryCodeInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        code: '',
        recovery_code: '',
    });

    const toggleRecovery = () => {
        clearErrors();
        if (recovery) {
            reset('recovery_code');
            setRecovery(false);
            setTimeout(() => codeInput.current?.focus(), 150);
        } else {
            reset('code');
            setRecovery(true);
            setTimeout(() => recoveryCodeInput.current?.focus(), 150);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('two-factor.login'), {
            onFinish: () => {
                if (recovery) {
                    reset('code');
                } else {
                    reset('recovery_code');
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Two-Factor Verification" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {recovery
                    ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
                    : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'}
            </div>

            <form onSubmit={submit} className="space-y-4">
                {!recovery ? (
                    <div>
                        <InputLabel htmlFor="code" value="Code" />

                        <TextInput
                            id="code"
                            type="text"
                            name="code"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            ref={codeInput}
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            className="mt-1 block w-full tracking-widest text-center text-lg font-bold"
                            autoComplete="one-time-code"
                            isFocused
                            placeholder="000000"
                        />

                        <InputError message={errors.code} className="mt-2" />
                    </div>
                ) : (
                    <div>
                        <InputLabel htmlFor="recovery_code" value="Recovery Code" />

                        <TextInput
                            id="recovery_code"
                            type="text"
                            name="recovery_code"
                            ref={recoveryCodeInput}
                            value={data.recovery_code}
                            onChange={(e) => setData('recovery_code', e.target.value)}
                            className="mt-1 block w-full text-center text-md font-mono"
                            autoComplete="off"
                            placeholder="abcdefghij-klmnopqrst"
                        />

                        <InputError message={errors.recovery_code} className="mt-2" />
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <button
                        type="button"
                        onClick={toggleRecovery}
                        className="text-sm text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100 underline decoration-dotted underline-offset-4 transition-colors"
                    >
                        {recovery ? 'Use an authenticator code' : 'Use a recovery code'}
                    </button>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Verifying...' : 'Log In'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
