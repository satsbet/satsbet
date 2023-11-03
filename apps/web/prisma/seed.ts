import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  console.time(`🦺 Created sample bets & quotes`);
  const bet1 = await prisma.bet.upsert({
    where: { id: "abc1" },
    update: {},
    create: {
      id: "abc1",
      amount: 100,
      lnAddress: "blah",
      status: "PENDING",
      target: "UP",
      invoicePaymentHash: "blah",
      invoiceRequestHash: "blah",
    },
  });
  const bet2 = await prisma.bet.upsert({
    where: { id: "abc2" },
    update: {},
    create: {
      id: "abc2",
      amount: 1020,
      lnAddress: "blah",
      status: "PAID",
      target: "UP",
      invoicePaymentHash: "blah",
      invoiceRequestHash: "blah",
    },
  });
  const bet3 = await prisma.bet.upsert({
    where: { id: "abc3" },
    update: {},
    create: {
      id: "abc3",
      amount: 500,
      lnAddress: "blah",
      status: "PAID",
      target: "UP",
      invoicePaymentHash: "blah",
      invoiceRequestHash: "blah",
    },
  });
  const bet4 = await prisma.bet.upsert({
    where: { id: "abc4" },
    update: {},
    create: {
      id: "abc4",
      amount: 11000,
      lnAddress: "blah",
      status: "PAID",
      target: "DOWN",
      invoicePaymentHash: "blah",
      invoiceRequestHash: "blah",
    },
  });

  const quoteToday = await prisma.quote.upsert({
    where: { id: "q1" },
    update: {},
    create: {
      id: "q1",
      price: 3200000,
    },
  });

  const quoteYesterday = await prisma.quote.upsert({
    where: { id: "q2" },
    update: {},
    create: {
      id: "q2",
      // yesterday
      day: new Date(Date.now() - 24 * 60 * 60 * 1000),
      price: 3100000,
    },
  });
  console.timeEnd(`🦺 Created sample bets & quotes`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
