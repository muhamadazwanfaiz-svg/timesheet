import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { LoginWizard } from "./components/login-wizard";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background branding elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="mb-10 relative z-10">
                <Link href="/" className="block hover:scale-105 transition-transform duration-300">
                    <Image
                        src="/logo.png"
                        alt="SEO Laoshi"
                        width={300}
                        height={100}
                        className="h-24 md:h-28 w-auto object-contain drop-shadow-sm"
                        priority
                    />
                </Link>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginWizard />
            </Suspense>
            <div className="mt-8 text-center text-sm text-slate-500 max-w-xs mx-auto">
                <p>Protected by reCAPTCHA and Subject to the Google <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a>.</p>
            </div>
        </div>
    );
}
