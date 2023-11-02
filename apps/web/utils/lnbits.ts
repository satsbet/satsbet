import LNBits from "lnbits";


export const { wallet, userManager, paywall, withdraw, paylink, tpos } = LNBits({
  adminKey: process.env.LN_ADMIN_KEY || "",
  invoiceReadKey: process.env.LN_INVOICE_READ_KEY || "",
  endpoint: process.env.LN_ENDPOINT || "",
});
