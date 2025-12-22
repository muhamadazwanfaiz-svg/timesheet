"use client";

import { ExternalLink } from "lucide-react";

interface NoteViewerProps {
    note: string | null;
}

export function NoteViewer({ note }: NoteViewerProps) {
    if (!note) return null;

    const renderWithLinks = (text: string) => {
        // Regex to find URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 break-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part} <ExternalLink size={10} />
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="text-sm text-slate-600 whitespace-pre-wrap">
            {renderWithLinks(note)}
        </div>
    );
}
