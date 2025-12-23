
import { addMinutes, areIntervalsOverlapping, differenceInMinutes, format, isBefore, isEqual, parseISO } from "date-fns";

export interface TimeRange {
    startTime: Date;
    endTime: Date;
}

export interface ViableSlot {
    startTime: Date;
    available: boolean;
}

export function getViableStartTimes(
    availability: TimeRange[],
    bookings: TimeRange[],
    durationMinutes: number
): ViableSlot[] {
    // 1. Sort availability by start time
    // Treat Bookings as "Availability Windows" too (so manual sessions show up as Locked slots)
    const combinedWindows = [...availability, ...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // 2. Sort bookings (used for blocking check)
    const sortedBookings = [...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const resultSlotsMap = new Map<number, ViableSlot>();

    // 3. Iterate through each window (Real Availability OR Existing Booking)
    for (const window of combinedWindows) {
        let currentPointer = new Date(window.startTime);
        const windowEnd = new Date(window.endTime);

        // While a slot of duration 'durationMinutes' fits within the remaining window
        while (addMinutes(currentPointer, durationMinutes) <= windowEnd) {
            const slotStart = new Date(currentPointer);
            const slotEnd = addMinutes(slotStart, durationMinutes);
            const timeKey = slotStart.getTime();

            // Avoid duplicates if windows overlap (e.g. Availability 10-12 overlaps Booking 10-11)
            if (!resultSlotsMap.has(timeKey)) {
                // Check if this specific slot overlaps with ANY existing booking
                const isBlocked = sortedBookings.some(booking => {
                    return areIntervalsOverlapping(
                        { start: slotStart, end: slotEnd },
                        { start: booking.startTime, end: booking.endTime },
                        { inclusive: false }
                    );
                });

                resultSlotsMap.set(timeKey, {
                    startTime: slotStart,
                    available: !isBlocked
                });
            }

            // Move pointer by 30 minutes (step)
            currentPointer = addMinutes(currentPointer, 30);
        }
    }

    // Convert Map values to array and sort
    return Array.from(resultSlotsMap.values()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}
