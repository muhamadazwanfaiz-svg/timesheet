"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Loader2, Sparkles, Target, BarChart3, Search, GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import { checkEmailStatus, activateAccount, registerStudent, loginStudent } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step =
    | "EMAIL_ENTRY"
    | "LOGIN_PASSWORD"
    | "ACTIVATE_PASSWORD"
    | "ONBOARDING_NAME"
    | "ONBOARDING_QUIZ"
    | "ONBOARDING_PASSWORD";

export function LoginWizard() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("EMAIL_ENTRY");
    const [loading, setLoading] = useState(false);

    // Data Store
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [seoLevel, setSeoLevel] = useState("Beginner");
    const [goals, setGoals] = useState("Traffic");

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await checkEmailStatus(email);
            if (result.status === "EXISTING") {
                setName(result.name || "");
                setStep("LOGIN_PASSWORD");
            } else if (result.status === "NEEDS_ACTIVATION") {
                setName(result.name || "");
                setStep("ACTIVATE_PASSWORD");
            } else {
                setStep("ONBOARDING_NAME");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            await loginStudent(formData);
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") {
                throw error;
            }
            toast.error("Invalid credentials.");
            setLoading(false);
        }
    };

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await activateAccount(email, password, name);
            toast.success("Account activated! Welcome to the team.");
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") throw error;
            toast.error("Activation failed.");
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerStudent({
                email,
                password,
                name: name || email.split("@")[0], // Fallback name
                seoLevel: "Beginner", // Default
                goals: "Traffic" // Default
            });
            toast.success("Account created! Let's get started.");
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") throw error;
            toast.error("Registration failed.");
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-indigo-100 dark:border-indigo-900 overflow-hidden relative">
            {/* Progress Bar (Invisible but functionally step tracking) */}

            <CardHeader className="space-y-1">
                {step === "EMAIL_ENTRY" && (
                    <>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Get Started
                        </CardTitle>
                        <CardDescription>Enter your email to login or sign up</CardDescription>
                    </>
                )}
                {step === "LOGIN_PASSWORD" && (
                    <>
                        <CardTitle className="text-xl">Welcome back, {name}</CardTitle>
                        <CardDescription>Enter your password to continue</CardDescription>
                    </>
                )}
                {step === "ACTIVATE_PASSWORD" && (
                    <>
                        <CardTitle className="text-xl">Activate Account</CardTitle>
                        <CardDescription>Set a secure password to claim your invite.</CardDescription>
                    </>
                )}
                {step === "ONBOARDING_NAME" && (
                    <>
                        <CardTitle className="text-xl">Nice to meet you!</CardTitle>
                        <CardDescription>What should we call you?</CardDescription>
                    </>
                )}

                {step === "ONBOARDING_QUIZ" && (
                    <>
                        <CardTitle className="text-xl">Quick Personalization</CardTitle>
                        <CardDescription>Help us tailor your learning path.</CardDescription>
                    </>
                )}

                {step === "ONBOARDING_QUIZ" && (
                    <>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            Let's tailor your path
                        </CardTitle>
                        <CardDescription>Help us understand your current focus.</CardDescription>
                    </>
                )}
                {step === "ONBOARDING_PASSWORD" && (
                    <>
                        <CardTitle className="text-xl">Secure your account</CardTitle>
                        <CardDescription>Last step! Create a login password.</CardDescription>
                    </>
                )}
            </CardHeader>

            <CardContent>
                {step === "EMAIL_ENTRY" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 text-lg"
                        />
                        <Button disabled={loading} type="submit" className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700">
                            {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                        </Button>
                    </form>
                )}

                {step === "LOGIN_PASSWORD" && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12"
                        />
                        <Button disabled={loading} type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700">
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </Button>
                        <button type="button" onClick={() => setStep("EMAIL_ENTRY")} className="w-full text-sm text-slate-500 hover:text-indigo-600 mt-2">
                            Not you? Change email
                        </button>
                    </form>
                )}

                {step === "ACTIVATE_PASSWORD" && (
                    <form onSubmit={handleActivate} className="space-y-4">
                        <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm mb-2 border border-amber-100">
                            👋 You have been invited by the admin. Please set your password to activate.
                        </div>
                        <Input
                            type="text"
                            placeholder="Your Name (Confirm)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12"
                        />
                        <Input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="h-12"
                        />
                        <Button disabled={loading} type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700">
                            {loading ? <Loader2 className="animate-spin" /> : "Activate & Login"}
                        </Button>
                    </form>
                )}

                {step === "ONBOARDING_NAME" && (
                    <form onSubmit={(e) => { e.preventDefault(); if (name) setStep("ONBOARDING_QUIZ"); }} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="e.g. Ali Baba"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-12 text-lg"
                            autoFocus
                        />
                        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                )}

                {step === "ONBOARDING_QUIZ" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        {/* Question 1 */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Which best describes you?
                            </label>
                            <div className="grid gap-2">
                                {[
                                    { id: "Beginner", label: "I'm totally new to SEO", desc: "Start from scratch" },
                                    { id: "Intermediate", label: "I know the basics", desc: "Ready to scale" },
                                    { id: "Business", label: "I'm a Business Owner", desc: "Need growth/ROI" },
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => setSeoLevel(opt.id)}
                                        className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between text-left transition-all ${seoLevel === opt.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                                    >
                                        <div>
                                            <div className={`font-medium text-sm ${seoLevel === opt.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {opt.label}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-500">
                                                {opt.desc}
                                            </div>
                                        </div>
                                        {seoLevel === opt.id && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                What is your #1 Goal right now?
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: "Traffic", icon: BarChart3, label: "Get More Traffic" },
                                    { id: "Rankings", icon: Search, label: "Rank Higher" },
                                    { id: "Career", icon: GraduationCap, label: "Land SEO Job" },
                                    { id: "Agency", icon: Briefcase, label: "Scale Agency" },
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => setGoals(opt.id)}
                                        className={`cursor-pointer rounded-lg border p-3 flex flex-col items-center justify-center text-center gap-2 h-24 transition-all ${goals === opt.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                                    >
                                        <opt.icon className={`h-6 w-6 ${goals === opt.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <span className={`text-xs font-medium ${goals === opt.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                                            {opt.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button onClick={() => setStep("ONBOARDING_PASSWORD")} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700">
                            Generate My Plan <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}

                {step === "ONBOARDING_PASSWORD" && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="h-12"
                        />
                        <Button disabled={loading} type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
                            {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                        </Button>
                    </form>
                )}

            </CardContent>
        </Card>
    );
}
