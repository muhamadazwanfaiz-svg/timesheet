
import { addMinutes, areIntervalsOverlapping, differenceInMinutes, format, isBefore, isEqual, parseISO } from "date-fns";

export interface TimeRange {
    startTime: Date;
    endTime: Date;
}

export function getViableStartTimes(
    availability: TimeRange[],
    bookings: TimeRange[],
    durationMinutes: number
): Date[] {
    // 1. Sort availability by start time
    const sortedAvailability = [...availability].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // 2. Sort bookings
    const sortedBookings = [...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const viableSlots: Date[] = [];

    // 3. Iterate through each availability window
    for (const window of sortedAvailability) {
        let currentPointer = new Date(window.startTime);
        const windowEnd = new Date(window.endTime);

        // While a slot of duration 'durationMinutes' fits within the remaining window
        while (addMinutes(currentPointer, durationMinutes) <= windowEnd) {
            const slotStart = new Date(currentPointer);
            const slotEnd = addMinutes(slotStart, durationMinutes);

            // Check if this specific slot overlaps with ANY existing booking
            const isBlocked = sortedBookings.some(booking => {
                return areIntervalsOverlapping(
                    { start: slotStart, end: slotEnd },
                    { start: booking.startTime, end: booking.endTime },
                    { inclusive: false } // inclusive: false means adjacent is okay (e.g. 8:00-9:00 and 9:00-10:00 is fine)
                );
            });

            if (!isBlocked) {
                viableSlots.push(slotStart);
            }

            // Move pointer by 30 minutes (step)
            // hardcoded step for now, could be configurable
            currentPointer = addMinutes(currentPointer, 30);
        }
    }

    return viableSlots;
}
