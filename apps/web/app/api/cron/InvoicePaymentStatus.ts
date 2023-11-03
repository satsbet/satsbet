import { prisma } from "@/utils/prisma";
import { BetStatus } from "@prisma/client";
import { lnbits } from "@/utils/lnbits";

export async function checkInvoicePaymentStatus(payment_hash: string) {
  const unpaidInvoices = await prisma.bet.findMany({
    select: {
      id: true,
      invoicePaymentHash: true,
    },
    where: {
      status: BetStatus.PENDING,
    },
  });

  unpaidInvoices.forEach(async ({ id, invoicePaymentHash }) => {
    try {
      const result = await lnbits.wallet.checkInvoice({
        payment_hash: invoicePaymentHash,
      });

      if (result.payment_hash) {
        await prisma.bet.update({
          where: {
            id: id,
          },
          data: {
            status: BetStatus.PAID,
          },
        });
      }
    } catch (error) {
      return error;
    }
  });
}
