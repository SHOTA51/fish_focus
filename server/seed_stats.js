const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'verify@example.com' } });
    if (!user) return console.log('User not found');

    // Total time
    await prisma.user.update({
      where: { id: user.id },
      data: { totalFocusTime: 120 }
    });

    // Sessions for today (Sunday, Sep 14 Bangkok time is current date roughly)
    // Current date is 2026-09-13.
    const now = new Date();
    
    await prisma.focusSession.createMany({
      data: [
        { userId: user.id, duration: 30, timestamp: new Date(), success: true },
        { userId: user.id, duration: 20, timestamp: new Date(), success: true },
        { userId: user.id, duration: 10, timestamp: new Date(), success: false }, // should be ignored
      ]
    });

    // Session for yesterday
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    await prisma.focusSession.create({
      data: { userId: user.id, duration: 40, timestamp: yesterday, success: true }
    });

    console.log('Data seeded');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
