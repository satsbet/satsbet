import { prisma } from "@/utils/prisma";
import { BetStatus, BetTarget } from "@prisma/client";
import {
  PENDING_BETS_WEIGHT_PERCENT,
  SATSBET_FEE_PERCENT,
  TOP_MULTIPLIER,
} from "./constants";

function getTodayBets() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0); // Set to the start of the next day

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
 * Calculate the multiplier for the pot
 *
 * @param pot The sum of the bets for the current day
 * @param other The other pot you want to compare with
 * @returns The multiplier for the pot
 */
export function calculateMultiplier(pot: number, other: number) {
  if (!other) {
    return TOP_MULTIPLIER;
  }
  const calculatedMultiplier =
    ((pot + other) * ((100 - SATSBET_FEE_PERCENT) / 100)) / pot;

  return Math.min(calculatedMultiplier, TOP_MULTIPLIER);
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
    up: calculateMultiplier(total.up, total.down),
    down: calculateMultiplier(total.down, total.up),
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
