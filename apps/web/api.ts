import { wallet, userManager, paywall, withdraw, paylink, tpos } from "./utils/lnbits";

export async function getUsers(){
    return await userManager.getUsers();
}

export async function createInvoice(amount: number, memo: string) {
    return await wallet.createInvoice({
        amount,
        memo,
        out: false,
    });
}

export async function payInvoice(bolt11: string) {
    return await wallet.payInvoice({
        bolt11,
        out: true,
      });
}

export async function checkInvoice(payment_hash: string) {
    return await wallet.checkInvoice({
        payment_hash,
      });

}