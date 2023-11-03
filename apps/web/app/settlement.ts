import { Bet, BetStatus, BetTarget, Quote } from "@prisma/client";
import { calculateMultiplier } from "./loader";
import { prisma } from "@/utils/prisma";
import { payInvoice } from "./actions";

export async function createLnAddressInvoice(
  lnAddress: string,
  amount: number,
) {
  const [username, domain] = lnAddress.split("@");

  // get random number from 0 to 100 to force cache clean
  const randomNumber = Math.floor(Math.random() * 100);

  const url = `https://${domain}/.well-known/lnurlp/${username}?cache=${randomNumber}`;
  const response = await fetch(url);
  const responseJson = await response.json();

  const { callback } = responseJson;
  const invoiceUrl = `${callback}?amount=${amount * 1000}`; // amount * 1000 to convert to milisatoshi

  const invoiceResponse = await fetch(invoiceUrl);
  const { pr } = await invoiceResponse.json();
  return pr;
}

export async function runSettlement() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const yesterdayQuote = await prisma.quote.findFirst({
    select: { price: true, id: true, day: true },
    where: {
      day: {
        gte: yesterday,
        lt: today,
      },
    },
  });
  if (!yesterdayQuote) {
    throw new Error(`No quote found for yesterday ${yesterday.toISOString()}`);
  }
  const todayQuote = await prisma.quote.findFirst({
    select: { price: true, id: true, day: true },
    where: {
      day: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
  if (!todayQuote) {
    throw new Error(`No quote found for today ${today.toISOString()}`);
  }
  const todayPaidBets = await prisma.bet.findMany({
    where: {
      status: BetStatus.PAID,
      createAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
  if (!!yesterdayQuote && !!todayQuote && !!todayPaidBets.length) {
    await processSettlement(yesterdayQuote, todayQuote, todayPaidBets);
  }
}

export async function processSettlement(
  yesterdayQuote: Quote,
  todayQuote: Quote,
  todayPaidBets: Bet[],
) {
  const betResult =
    todayQuote.price > yesterdayQuote.price ? BetTarget.UP : BetTarget.DOWN;
  const { amountUp, amountDown } = calculateAmounts(todayPaidBets);
  let multiplier = localCalculateMultiplier(betResult, amountUp, amountDown);

  // Get bets based on the result
  const winBets = todayPaidBets.filter((bet) => bet.target === betResult);
  const lostBets = todayPaidBets.filter((bet) => bet.target !== betResult);

  // Create a promise for each bet and process them in parallel
  const winBetsPromises = winBets.map((bet) => {
    const newStatus = betResult === bet.target ? BetStatus.WIN : BetStatus.LOST;
    return processBet(newStatus, bet, multiplier); // assuming processBet is async and returns a Promise
  });

  const lostBetsPromises = lostBets.map((bet) => {
    return updateBetStatus(bet.id, BetStatus.LOST);
  });

  // Wait for all the bet processing to complete
  await Promise.all([...winBetsPromises, ...lostBetsPromises]);
}

export function localCalculateMultiplier(
  betResult: BetTarget,
  amountUp: number,
  amountDown: number,
) {
  return betResult === BetTarget.UP
    ? calculateMultiplier(amountUp, amountDown)
    : calculateMultiplier(amountDown, amountUp);
}

function calculateAmounts(todayPaidBets: Bet[]) {
  return todayPaidBets.reduce(
    (acc, bet) => {
      if (bet.target === BetTarget.UP) {
        acc.amountUp += Number(bet.amount);
      } else {
        acc.amountDown += Number(bet.amount);
      }
      return acc;
    },
    { amountUp: 0, amountDown: 0 },
  );
}

async function processBet(newStatus: BetStatus, bet: Bet, multiplier: number) {
  const amountToPay =
    newStatus === BetStatus.WIN ? Number(bet.amount) * multiplier : 0;
  bet.status = newStatus;
  await updateBetStatus(bet.id, bet.status);
  if (!!amountToPay) {
    const paymentRequest = await createLnAddressInvoice(
      bet.lnAddress,
      amountToPay,
    );
    const paymentStatus = (await payInvoice(paymentRequest)) as any;

    paymentStatus.payment_hash
      ? await updateBetStatus(bet.id, BetStatus.REFUNDED)
      : await updateBetStatus(bet.id, BetStatus.PROBLEM);
  }
}

async function updateBetStatus(betId: string, status: BetStatus) {
  await prisma.bet.update({
    where: { id: betId },
    data: { status },
  });
}
