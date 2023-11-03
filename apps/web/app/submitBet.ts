import { prisma } from "@/utils/prisma";
import { BetStatus, BetTarget } from "@prisma/client";
import { createInvoice } from "./actions";

export type SubmitBetInput = {
  amount: bigint;
  target: BetTarget;
  lnAddress: string;
};

export async function submitBet(bet: SubmitBetInput) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day
  await prisma.bet.create({
    data: {
      ...bet,
      status: BetStatus.PENDING,
      createAt: today,
    },
  });

  const lnbitsResponse = await createInvoice(
    Number(bet.amount),
    "Thank you for betting with Satoshi!",
  );
  return lnbitsResponse.payment_request;
}
