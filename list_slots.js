const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const slots = await prisma.slot.findMany({
        include: { student: true }
    });
    console.log(`Total slots: ${slots.length}`);
    slots.forEach(s => {
        console.log(`- ${s.startTime.toISOString()} | Student: ${s.student?.name} | Status: ${s.status} | Notes: "${s.classNotes}"`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
