
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const student = await prisma.student.findUnique({
            where: { email: "muhamadazwanfaiz@gmail.com" }
        });
        console.log("FRESH CLIENT RESULT:", JSON.stringify(student, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
