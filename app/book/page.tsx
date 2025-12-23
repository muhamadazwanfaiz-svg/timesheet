import { getAvailability, getBookings, getCalculatedSlots } from "@/app/actions/availability";
import { BookingView } from "./components/booking-view";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { StudentLogoutButton } from "@/components/student-logout-button";

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;

    if (!studentId) {
        redirect("/login?callbackUrl=/book");
    }

    // Fetch student credits and active reservations
    const student = await prisma.student.findUnique({
        where: { id: studentId },
    });

    if (!student) {
        // Invalid session
        redirect("/login?callbackUrl=/book");
    }

    const activeReservations = await prisma.slot.count({
        where: {
            studentId: studentId,
            status: "SCHEDULED"
        }
    });

    const { date: dateStr } = await searchParams;
    const today = new Date();
    // specific date selected by user, OR default to today
    const selectedDate = dateStr ? new Date(dateStr) : today;

    // Fetch slots for next 14 days
    // Fetch available slots
    // const endDate = addDays(today, 14); // We might need this for the calendar view if we want to pre-fetch, but for now let's just stick to daily
    const calculatedSlots = await getCalculatedSlots(selectedDate, student.id);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto mb-8 w-full flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-1">
                        Book Your Session
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-center md:justify-start">
                        Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{student.name}</span>.
                        <div className="inline-block md:hidden">
                            <StudentLogoutButton />
                        </div>
                    </p>
                    <div className="hidden md:block mt-2">
                        <StudentLogoutButton />
                    </div>
                </div>

                {/* Credit Balance Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl px-6 py-3 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Available Credits</p>
                        <p className={`text-2xl font-black ${student.credits - activeReservations > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-500"}`}>
                            {student.credits - activeReservations}
                        </p>
                    </div>
                    {activeReservations > 0 && (
                        <div className="text-xs text-slate-400 border-l pl-4 border-slate-100 dark:border-slate-800">
                            <p>Total: {student.credits}</p>
                            <p>Reserved: {activeReservations}</p>
                        </div>
                    )}
                </div>
            </div>

            <BookingView
                date={selectedDate}
                student={student}
                slots={calculatedSlots}
            />
        </div>
    );
}
