"use server";

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
