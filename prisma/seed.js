const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Create Students
    const alice = await prisma.student.create({
        data: {
            email: 'alice@example.com',
            name: 'Alice (Standard)',
            credits: 10,
            defaultDurationMinutes: 60,
            module: 'SEO Basics',
        },
    });

    const bob = await prisma.student.create({
        data: {
            email: 'bob@example.com',
            name: 'Bob (Extended)',
            credits: 10,
            defaultDurationMinutes: 90,
            module: 'Advanced Analytics',
        },
    });

    const charlie = await prisma.student.create({
        data: {
            email: 'charlie@example.com',
            name: 'Charlie (Short)',
            credits: 5,
            defaultDurationMinutes: 30,
            module: 'Content writing',
        },
    });

    console.log('Created 3 students.');

    // 2. Create Availability for the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availabilities = [];

    // Create usage for next 7 days: 09:00 - 18:00
    for (let i = 0; i < 7; i++) {
        const dayStart = new Date(today);
        dayStart.setDate(today.getDate() + i);
        dayStart.setHours(9, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setHours(18, 0, 0, 0);

        availabilities.push({
            startTime: dayStart,
            endTime: dayEnd,
        });
    }

    await prisma.availability.createMany({
        data: availabilities,
    });

    console.log(`Created availability for next 7 days.`);

    // 3. Create a test booking for Alice tomorrow at 10am
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(11, 0, 0, 0); // 1 hour for Alice

    await prisma.slot.create({
        data: {
            startTime: tomorrow,
            endTime: tomorrowEnd,
            studentId: alice.id,
            status: 'SCHEDULED',
            classNotes: 'Intro session',
        }
    });

    console.log('Created test booking for Alice.');
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
