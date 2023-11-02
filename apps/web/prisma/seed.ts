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
