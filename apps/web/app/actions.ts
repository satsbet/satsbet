"use server";

import { z } from "zod";
import { lnbits } from "@/utils/lnbits";
import { BetTarget, BetStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/prisma";

// pay the invoice the user created
export async function payInvoice(bolt11: string) {
  // TODO: move this to another place
  return await lnbits.wallet.payInvoice({
    bolt11,
    out: true,
  });
}

const schema = z.object({
  target: z.nativeEnum(BetTarget),
  amount: z.coerce.bigint().positive(),
  lnAddress: z
    .string()
    .email("Please enter a lightning address")
    .or(z.string().startsWith("ln")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .or(z.literal("")),
});

export async function createBet(prevState: any, formData: FormData) {
  const data = schema.safeParse({
    target: formData.get("target"),
    amount: formData.get("amount"),
    lnAddress: formData.get("lnAddress"),
    email: formData.get("email"),
  });

  if (!data.success) {
    return data.error.flatten();
  }

  const bet = data.data;

  console.log(bet.amount);
  console.log(Number(bet.amount));

  // create lightning invoice for the bet
  const lnbitsResponse = await lnbits.wallet.createInvoice({
    amount: Number(bet.amount),
    memo: "Thank you for betting with Satoshi!",
    out: false,
  });

  console.log(lnbitsResponse);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // save the bet to the database
  const { id } = await prisma.bet.create({
    data: {
      ...bet,
      status: BetStatus.PENDING,
      createAt: today,
      invoicePaymentHash: lnbitsResponse.payment_hash,
      invoiceRequestHash: lnbitsResponse.payment_request,
    },
  });

  redirect(`/${id}`);
}
