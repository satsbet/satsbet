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

  // TODO: close betting

  if (!data.success) {
    return data.error.flatten();
  }

  const bet = data.data;

  // create lightning invoice for the bet
  const lnbitsResponse = await lnbits.wallet.createInvoice({
    amount: Number(bet.amount),
    memo: "Thank you for betting with Satoshi!",
    // @ts-expect-error
    webhook: "https://satsbet.vercel.app/api/cron/payment",
    out: false,
  });

  // save the bet to the database
  const { id } = await prisma.bet.create({
    data: {
      ...bet,
      createAt: new Date(),
      invoicePaymentHash: lnbitsResponse.payment_hash,
      invoiceRequestHash: lnbitsResponse.payment_request,
    },
  });

  redirect(`/${id}`);
}

// pay the invoice the user created
export async function setBTCLastPrice(price: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set to the start of the day

  // find the quote for today, if it exists, update it, otherwise create it
  const todaysQuotation = await prisma.quote.findMany({
    where: {
      day: {
        gte: today,
      },
    },
  });

  if (todaysQuotation.length === 0) {
    await prisma.quote.create({
      data: {
        day: today,
        price: price,
      },
    });
  } else {
    await prisma.quote.update({
      where: {
        id: todaysQuotation[0].id,
      },
      data: {
        price: price,
      },
    });
  }
}
