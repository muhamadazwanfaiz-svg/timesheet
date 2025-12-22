import { getStudents } from "@/app/actions/students";
import { AddStudentDialog } from "./components/add-student-dialog";
import { StudentTable } from "./components/student-table";

export default async function StudentsPage() {
    const students = await getStudents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Students
                </h2>
                <AddStudentDialog />
            </div>

            <StudentTable students={students} />
        </div>
    );
}
