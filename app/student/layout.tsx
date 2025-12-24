import { StudentMobileNav } from "@/components/student-mobile-nav";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 pb-20 lg:pb-0">
                {children}
            </main>
            <StudentMobileNav />
        </div>
    );
}
