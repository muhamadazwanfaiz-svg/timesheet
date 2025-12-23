const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting cleanup of backfilled sessions...");

    // 1. Find all backfilled sessions
    const backfills = await prisma.slot.findMany({
        where: {
            classNotes: "Backfilled Session",
        }
    });

    console.log(`Found ${backfills.length} backfilled sessions.`);

    if (backfills.length === 0) {
        console.log("No backfills to delete.");
        return;
    }

    // 2. Process deletions and refunds
    for (const slot of backfills) {
        if (slot.studentId) {
            // Refund credit
            await prisma.student.update({
                where: { id: slot.studentId },
                data: { credits: { increment: 1 } }
            });
            // console.log(`Refunded 1 credit to student ${slot.studentId}`);
        }

        // Delete slot
        await prisma.slot.delete({
            where: { id: slot.id }
        });
    }

    console.log(`Successfully deleted ${backfills.length} sessions and refunded credits.`);
}

main()
    .catch(e => {
        console.error("Error during cleanup:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
