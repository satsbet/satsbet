import { prisma } from "@/utils/prisma";
import { BetStatus, BetTarget } from "@prisma/client";
import { PENDING_BETS_WEIGHT_PERCENT } from "./constants";
import { calculateProfit } from "../utils/multiplier";

function getTodayBets() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set to the start of the day
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0); // Set to the start of the next day

  return prisma.bet.findMany({
    select: {
      amount: true,
      target: true,
      status: true,
    },
    where: {
      createAt: {
        gte: today,
        lt: tomorrow,
      },
      OR: [
        {
          status: BetStatus.PAID,
        },
        {
          status: BetStatus.PENDING,
        },
      ],
    },
  });
}

/**
 * Get the multiplier for the current day
 *
 * @returns {Promise<{up: number, down: number}>} The multiplier for up and down
 */
export async function getMultiplier() {
  const todayBets = await getTodayBets();

  const total = todayBets.reduce(
    (acc, bet) => {
      const amount =
        bet.status === "PENDING"
          ? Number(bet.amount) * PENDING_BETS_WEIGHT_PERCENT
          : Number(bet.amount);

      if (bet.target === BetTarget.UP) {
        acc.up += amount;
      } else {
        acc.down += amount;
      }
      return acc;
    },
    { up: 0, down: 0 },
  );

  return {
    up: calculateProfit(total.up, total.down) + 1,
    down: calculateProfit(total.down, total.up) + 1,
  };
}

/** Show the price from yesterday's btc */
export async function getLastQuote() {
  return prisma.quote.findFirst({
    orderBy: {
      day: "desc",
    },
  });
}
