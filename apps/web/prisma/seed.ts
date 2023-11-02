import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bet1 = await prisma.bet.upsert({
    where: { id: "abc1" },
    update: {},
    create: {
      id: "abc1",
      amount: 100,
      lnAddress: "blah",
      status: "PENDING",
      target: "UP",
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

  console.log({ bet1, quoteToday, quoteYesterday });
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
