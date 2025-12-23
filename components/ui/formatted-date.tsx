"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
    date: Date | string;
    mode?: "date" | "time" | "datetime" | "full";
    className?: string;
}

export function FormattedDate({ date, mode = "datetime", className }: FormattedDateProps) {
    // Avoid hydration mismatch by waiting for mount
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder or server time to avoid layout shift (optional)
        // For now, render nothing or a skeleton to be safe
        return <span className={className}>...</span>;
    }

    const d = new Date(date);

    let formatted = "";

    if (mode === "date") {
        formatted = d.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else if (mode === "time") {
        formatted = d.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (mode === "datetime") {
        formatted = d.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    } else if (mode === "full") {
        formatted = d.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }

    return <span className={className}>{formatted}</span>;
}
