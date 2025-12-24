import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { LoginWizard } from "./components/login-wizard";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Image
                        src="/logo.png"
                        alt="SEO Laoshi Logo"
                        width={200}
                        height={70}
                        className="h-16 w-auto object-contain"
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
