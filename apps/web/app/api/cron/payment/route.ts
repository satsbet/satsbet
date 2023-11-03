import { prisma } from "@/utils/prisma";
import { BetStatus } from "@prisma/client";
import { lnbits } from "@/utils/lnbits";

export async function GET() {
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
      const result = (await lnbits.wallet.checkInvoice({
        payment_hash: invoicePaymentHash,
      })) as any;

      if (result.paid) {
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
  return Response.json({ dispatched: true });
}
