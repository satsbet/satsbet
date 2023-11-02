import LNBits from "lnbits"; // using import

export const { wallet, userManager, paywall, withdraw, paylink, tpos } = LNBits({
  adminKey: 'c1363046069c4ed2b91ab78d19eb1836',
  invoiceReadKey: 'd9fdb259c8744fdc859d4f1fe25f7692',
  endpoint: 'https://9a76e1ccb3.d.voltageapp.io',
});
