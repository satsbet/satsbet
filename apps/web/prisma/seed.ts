import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bet1 = await prisma.bet.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      amount: 100,
      day: new Date(),
      lnAddress: "blah",
      price: 100,
      status: "PENDING",
      target: "UP",
    },
  });

  console.log({ alice: bet1 });
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
