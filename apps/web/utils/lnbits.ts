import LNBits from "lnbits";
import { env } from "./env";

export const lnbits = LNBits({
  adminKey: env.LNBITS_ADMIN_KEY,
  invoiceReadKey: env.LNBITS_INVOICE_READ_KEY,
  endpoint: env.LNBITS_ENDPOINT,
});
