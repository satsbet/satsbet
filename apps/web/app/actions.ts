"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { lnbits } from "@/utils/lnbits";

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
