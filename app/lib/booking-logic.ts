
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
    const sortedAvailability = [...availability].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // 2. Sort bookings
    const sortedBookings = [...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const viableSlots: ViableSlot[] = [];

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
                    { inclusive: false }
                );
            });

            // FOMO Logic: Return ALL slots, but mark blocked ones as unavailable
            viableSlots.push({
                startTime: slotStart,
                available: !isBlocked
            });

            // Move pointer by 30 minutes (step)
            currentPointer = addMinutes(currentPointer, 30);
        }
    }

    return viableSlots;
}
