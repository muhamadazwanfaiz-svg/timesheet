"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


// Assuming you don't have a specific `getAllStudents` action exposed for this component yet, 
// I'll assume we need to pass students or fetch them. 
// For now, I'll create a simple client-side fetcher if needed, but optimally we pass valid options.
// Actually, let's look at `app/actions/user.ts` or similar? 
// I'll stick to a simple clean props interface for now to be safe.

interface Student {
    id: string;
    name: string;
    email: string;
}

interface StudentSelectProps {
    value?: string;
    onValueChange: (value: string) => void;
    students: Student[];
}

export function StudentSelect({ value, onValueChange, students }: StudentSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
                {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                        <div className="flex flex-col text-left">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-xs text-slate-500">{student.email}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
