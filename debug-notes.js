
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const student = await prisma.student.findUnique({
            where: { email: "muhamadazwanfaiz@gmail.com" },
            include: {
                slots: {
                    orderBy: { startTime: "desc" }
                }
            }
        });

        console.log("Student:", student.name);
        console.log("Total Slots:", student.slots.length);

        const completed = student.slots.filter(s => s.status === "COMPLETED");
        console.log("Completed Slots:", completed.length);

        const withNotes = completed.filter(s => s.classNotes);
        console.log("Slots with Notes:", withNotes.length);

        if (withNotes.length > 0) {
            console.log("Latest Note:", withNotes[0].classNotes);
        } else {
            console.log("NO NOTES FOUND. This is why the section is hidden.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
