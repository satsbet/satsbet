import { prisma } from '@/utils/prisma'
import { BetTarget } from '@prisma/client';
import { SATSBET_FEE_PERCENT, TOP_MULTIPLIER } from './constants';

export function getTodayPaidBets() {
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
            day: {
                gte: today,
                lt: tomorrow,
            },
        }
    })
}

export function calculateMultiplier(amount1: bigint, amount2: bigint) {
    if (!amount2) {
        return TOP_MULTIPLIER;
    }
    const calculatedMultiplier = (amount1 * ((100n - SATSBET_FEE_PERCENT) / 100n)) / amount2;
    return Math.min(Number(calculatedMultiplier), TOP_MULTIPLIER);
}

export async function getMultiplier() {
    let amountUp = 0n;
    let amountDown = 0n;

    const todayPaidBets = await getTodayPaidBets();
    for (let i = 0; i < todayPaidBets.length; i++) {
        let todayPaidBet = todayPaidBets[i]
        if (todayPaidBet.target === BetTarget.UP) {
            amountUp = amountUp + todayPaidBet.amount;
        } else {
            amountDown += todayPaidBet.amount;
        }
    }

    return {
        up: calculateMultiplier(amountUp, amountDown),
        down: calculateMultiplier(amountDown, amountUp),
    };
}