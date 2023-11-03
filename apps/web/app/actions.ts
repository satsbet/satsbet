"use server";

import { z } from "zod";
import { lnbits } from "@/utils/lnbits";
import { BetTarget } from "@prisma/client";
import { submitBet } from "./submitBet";

// create the lnbits invoice
export async function createInvoice(amount: number, memo: string) {
  try {
    return await lnbits.wallet.createInvoice({
      amount,
      memo,
      out: false,
    });
  } catch (error) {
    return error;
  }
}

// pay the invoice the user created
export async function payInvoice(bolt11: string) {
  try {
    return await lnbits.wallet.payInvoice({
      bolt11,
      out: true,
    });
  } catch (error) {
    return error;
  }
}

// check if the user has paid the invoice
export async function checkInvoice(payment_hash: string) {
  try {
    return await lnbits.wallet.checkInvoice({
      payment_hash,
    });
  } catch (error) {
    return error;
  }
}

const schema = z.object({
  target: z.nativeEnum(BetTarget),
  amount: z.coerce.bigint().positive(),
  lnAddress: z.string().email("Please enter a lightning address"),
  email: z.string().email("Please enter a valid email address").optional(),
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

  await submitBet(data.data);

  return { message: "success" };
}
