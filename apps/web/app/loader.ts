import { prisma } from "@/utils/prisma";
import { BetStatus, BetTarget } from "@prisma/client";
import {
  PENDING_BETS_WEIGHT_PERCENT,
  SATSBET_FEE_PERCENT,
  TOP_MULTIPLIER,
} from "./constants";

function getTodayBets(status: BetStatus) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0); // Set to the start of the next day

  return prisma.bet.findMany({
    select: {
      amount: true,
      target: true,
    },
    where: {
      createAt: {
        gte: today,
        lt: tomorrow,
      },
      status,
    },
  });
}

export function calculateMultiplier(amount1: number, amount2: number) {
  if (!amount2) {
    return TOP_MULTIPLIER;
  }
  const calculatedMultiplier =
    ((amount1 + amount2) * ((100 - SATSBET_FEE_PERCENT) / 100)) / amount1;
  return Math.min(Number(calculatedMultiplier), TOP_MULTIPLIER);
}

/**
 * Get the multiplier for the current day
 *
 * @returns {Promise<{up: number, down: number}>} The multiplier for up and down
 */
export async function getMultiplier() {
  let amountUp = 0n;
  let amountDown = 0n;

  const todayPaidBets = await getTodayBets(BetStatus.PAID);
  for (let i = 0; i < todayPaidBets.length; i++) {
    let todayPaidBet = todayPaidBets[i];
    if (todayPaidBet.target === BetTarget.UP) {
      amountUp = amountUp + todayPaidBet.amount;
    } else {
      amountDown += todayPaidBet.amount;
    }
  }
  const todayPendingBets = await getTodayBets(BetStatus.PENDING);
  for (let i = 0; i < todayPendingBets.length; i++) {
    let todayPaidBet = todayPendingBets[i];
    if (todayPaidBet.target === BetTarget.UP) {
      amountUp += BigInt(
        (Number(todayPaidBet.amount) * PENDING_BETS_WEIGHT_PERCENT) / 100,
      );
    } else {
      amountDown += BigInt(
        (Number(todayPaidBet.amount) * PENDING_BETS_WEIGHT_PERCENT) / 100,
      );
    }
  }

  return {
    up: calculateMultiplier(Number(amountUp), Number(amountDown)),
    down: calculateMultiplier(Number(amountDown), Number(amountUp)),
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
