"use client";

import { useState } from "react";
import { updateClassNotes } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SessionNotesEditorProps {
    slotId: string;
    initialNotes: string | null;
}

export function SessionNotesEditor({ slotId, initialNotes }: SessionNotesEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState(initialNotes || "");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            await updateClassNotes(slotId, notes);
            toast.success("Notes saved");
            setIsEditing(false);
        } catch (e) {
            toast.error("Failed to save notes");
        } finally {
            setSaving(false);
        }
    }

    // Function to render text with clickable links
    const renderWithLinks = (text: string) => {
        if (!text) return <span className="text-slate-400 italic">No notes</span>;

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
                        className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part} <ExternalLink size={10} />
                    </a>
                );
            }
            return part;
        });
    };

    if (isEditing) {
        return (
            <div className="space-y-2 w-full min-w-[250px]">
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add session details, homework, or links..."
                    className="min-h-[80px] w-full resize-none"
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                    >
                        <X size={14} />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Check size={14} className="mr-1" />
                        Save
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group relative w-full h-full min-h-[40px] cursor-pointer rounded p-2 hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all"
            onClick={() => setIsEditing(true)}
        >
            <div className="text-sm text-slate-600 whitespace-pre-wrap">
                {renderWithLinks(notes)}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil size={12} className="text-slate-400" />
            </div>
        </div>
    );
}
