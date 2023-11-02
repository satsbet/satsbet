"use server";

import { lnbits } from "@/utils/lnbits";

export async function getUsers() {
  return await lnbits.userManager.getUsers();
}

export async function createInvoice(amount: number, memo: string) {
  return await lnbits.wallet.createInvoice({
    amount,
    memo,
    out: false,
  });
}

export async function payInvoice(bolt11: string) {
  return await lnbits.wallet.payInvoice({
    bolt11,
    out: true,
  });
}

export async function checkInvoice(payment_hash: string) {
  return await lnbits.wallet.checkInvoice({
    payment_hash,
  });
}
