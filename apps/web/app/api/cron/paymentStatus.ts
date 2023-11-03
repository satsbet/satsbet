import { NextResponse } from "next/server";
import { lnbits } from "@/utils/lnbits";

export async function checkInvoice(payment_hash: string) {
  const result = await lnbits.wallet.checkInvoice({
    payment_hash,
  });
  console.log(result);
  return result;
}
