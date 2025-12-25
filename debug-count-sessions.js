
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const now = new Date();

    // Count CANCELED upcoming
    const canceledCount = await prisma.slot.count({
        where: {
            endTime: { gte: now },
            status: 'CANCELED'
        }
    });
    console.log(`Canceled Upcoming Sessions: ${canceledCount}`);

    // Fetch what the Page is fetching (No status filter)
    const pageView = await prisma.slot.findMany({
        where: {
            endTime: { gte: now },
            studentId: { not: null },
        },
        orderBy: { startTime: 'asc' },
        take: 5,
        include: { student: true }
    });

    console.log("--- Page View (take: 5, NO status filter) ---");
    pageView.forEach((s, i) => {
        console.log(`${i + 1}. ${s.startTime.toISOString()} - ${s.student?.name} [${s.status}]`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
