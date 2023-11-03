import { Bet, BetStatus, BetTarget, Quote } from "@prisma/client";
import { calculateMultiplier } from "./multipliers";
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
  console.log(invoiceUrl);

  const invoiceResponse = await fetch(invoiceUrl);
  const { pr } = await invoiceResponse.json();
  console.log(pr);
  return pr;
}

export async function runSettlement() {
  const yesterdayQuote = await prisma.quote.findFirst({
    orderBy: { day: "desc" },
    skip: 1,
  });
  const todayQuote = await prisma.quote.findFirst({
    orderBy: { day: "desc" },
  });
  const todayPaidBets = await prisma.bet.findMany({
    where: { status: BetStatus.PAID },
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
  let multiplier =
    betResult === BetTarget.UP
      ? calculateMultiplier(Number(amountUp), Number(amountDown))
      : calculateMultiplier(Number(amountDown), Number(amountUp));

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

function calculateAmounts(todayPaidBets: Bet[]) {
  return todayPaidBets.reduce(
    (acc, bet) => {
      if (bet.target === BetTarget.UP) {
        acc.amountUp += bet.amount;
      } else {
        acc.amountDown += bet.amount;
      }
      return acc;
    },
    { amountUp: 0n, amountDown: 0n },
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
    const paymentStatus = await payInvoice(paymentRequest);
    console.log(paymentStatus);

    paymentStatus === "paid"
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
