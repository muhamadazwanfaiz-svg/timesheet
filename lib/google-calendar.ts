export function generateGoogleCalendarUrl(event: {
    title: string;
    details: string;
    startTime: Date;
    endTime: Date;
    location?: string;
}) {
    // Format dates to YYYYMMDDTHHMMSSZ (UTC)
    const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const start = formatTime(event.startTime);
    const end = formatTime(event.endTime);

    // Construct Google Calendar URL
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", event.title);
    url.searchParams.append("dates", `${start}/${end}`);
    url.searchParams.append("details", event.details);
    if (event.location) url.searchParams.append("location", event.location);

    return url.toString();
}
