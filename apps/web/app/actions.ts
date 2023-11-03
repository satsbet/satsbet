"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { lnbits } from "@/utils/lnbits";

// create the lnbits invoice
export async function createInvoice(amount: number, memo: string) {
  return await lnbits.wallet.createInvoice({
    amount,
    memo,
    out: false,
  });
}

// pay the invoice the user created
export async function payInvoice(bolt11: string) {
  return await lnbits.wallet.payInvoice({
    bolt11,
    out: true,
  });
}

// check if the user has paid the invoice
export async function checkInvoice(payment_hash: string) {
  return await lnbits.wallet.checkInvoice({
    payment_hash,
  });
}

const schema = z.object({
  todo: z.string().min(2),
});

export async function createTodo(prevState: any, formData: FormData) {
  const data = schema.safeParse({
    todo: formData.get("todo"),
  });

  if (!data.success) {
    return { message: "Failed to create todo" };
  }

  console.log("🔥 ~ ", data);
  return { message: "success" };
}
