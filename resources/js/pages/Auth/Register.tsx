import { useState } from "react";
import { Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import heroBuilding from "@/assets/hero-building.jpg";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen">
                {/* Left Panel - Hero */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img
                        src={heroBuilding}
                        alt="Modern apartment building"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50" />
                    <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
                                <Building2 className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <span className="text-xl font-bold font-body tracking-tight">ImmoFlow</span>
                        </div>

                        <div className="max-w-md">
                            <h1 className="text-4xl xl:text-5xl font-display font-bold leading-tight mb-6">
                                Manage your properties with confidence
                            </h1>
                            <p className="text-lg opacity-80 font-body leading-relaxed">
                                Streamline your real estate portfolio with powerful tools for tenant management, financial tracking, and maintenance workflows.
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-2xl font-bold font-display">2,400+</p>
                                <p className="text-sm opacity-70">Properties managed</p>
                            </div>
                            <div className="w-px h-10 bg-primary-foreground/20" />
                            <div>
                                <p className="text-2xl font-bold font-display">98%</p>
                                <p className="text-sm opacity-70">Client satisfaction</p>
                            </div>
                            <div className="w-px h-10 bg-primary-foreground/20" />
                            <div>
                                <p className="text-2xl font-bold font-display">€1.2B</p>
                                <p className="text-sm opacity-70">Assets tracked</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Register Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
                    <div className="w-full max-w-md animate-fade-in">
                        {/* Mobile Logo */}
                        <div className="flex items-center gap-3 mb-10 lg:hidden">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
                                <Building2 className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <span className="text-xl font-bold font-body text-foreground tracking-tight">ImmoFlow</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-display font-bold text-foreground mb-2">Create account</h2>
                            <p className="text-muted-foreground font-body">Join ImmoFlow to manage your properties</p>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 mb-6">
                                <svg className="w-5 h-5 text-destructive shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-destructive font-body">Unable to register</p>
                                    <p className="text-sm text-destructive/80 font-body mt-0.5">
                                        {errors.name || errors.email || errors.password || errors.password_confirmation || 'Please check the form for errors.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Create a strong password"
                                        className="w-full h-12 px-4 pr-12 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your password"
                                        className="w-full h-12 px-4 pr-12 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 mt-6 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-card disabled:opacity-50"
                            >
                                {processing ? 'Creating account...' : 'Create account'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-muted-foreground font-body">
                            Already have an account?{" "}
                            <Link href={route('login')} className="text-accent font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
