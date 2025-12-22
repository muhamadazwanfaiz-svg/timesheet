import { getStudents } from "@/app/actions/students";
import { AddStudentDialog } from "./components/add-student-dialog";
// import { StudentTable } from "./components/student-table";
import { StudentCard } from "./components/student-card";

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

            {/* <StudentTable students={students} /> -- Deprecated for Grid View */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                ))}
            </div>
        </div>
    );
}
