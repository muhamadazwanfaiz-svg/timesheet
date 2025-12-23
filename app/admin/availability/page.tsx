import { getAvailability, getBookings } from "@/app/actions/availability";
import { AvailabilityManager } from "./components/availability-manager";


export default async function AvailabilityPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const { date: dateStr } = await searchParams;
    const date = dateStr ? new Date(dateStr) : new Date();

    const availability = await getAvailability(date);
    const bookings = await getBookings(date);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        Availability
                    </h2>
                    <p className="text-slate-500">
                        Set your free time for students to book.
                    </p>
                </div>
                {/* Recurring dialog replaced by inline checkbox */}
            </div>

            <AvailabilityManager date={date} availability={availability} bookings={bookings} />
        </div>
    );
}
