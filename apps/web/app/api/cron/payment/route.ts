import { prisma } from "@/utils/prisma";
import { BetStatus, BetTarget } from "@prisma/client";
import { lnbits } from "@/utils/lnbits";
import { pusherServer } from "@/utils/pusher.server";
import { getMultiplier } from "@/app/loader";

/** Used to validate that the user has payed a invoice */
export async function GET() {
  // Mark all unpaid invoices that have more than 5 min as expired
  await expireInvoices();

  // FIX: this should come from a webhook but lnbits is not sending it
  await payInvoices();

  return Response.json({ dispatched: true });
}

async function payInvoices() {
  const unpaidInvoices = await prisma.bet.findMany({
    select: {
      id: true,
      target: true,
      invoicePaymentHash: true,
    },
    where: {
      status: BetStatus.PENDING,
    },
  });

  const invoice = await Promise.all(
    unpaidInvoices.map(async (i) => ({
      ...i,
      paid: await hasPaid(i),
    })),
  );

  // update the status of the bet to paid
  const paidInvoices = invoice.filter((i) => i.paid);
  const paidInvoicesIds = paidInvoices.map((i) => i.id);
  await prisma.bet.updateMany({
    where: {
      id: {
        in: paidInvoicesIds,
      },
    },
    data: {
      status: BetStatus.PAID,
    },
  });

  if (paidInvoicesIds.length > 0) {
    // Trigger an event on the client
    await pusherServer.trigger(paidInvoicesIds, "payment.succeeded", {});
    await pusherServer.trigger("home", "payment.succeeded", {
      targets: paidInvoices.map((i) => i.target),
      multiplier: await getMultiplier(),
    });
  }
}

async function hasPaid({ invoicePaymentHash }: { invoicePaymentHash: string }) {
  try {
    const result = (await lnbits.wallet.checkInvoice({
      payment_hash: invoicePaymentHash,
    })) as unknown as {
      paid: boolean;
    };

    return result.paid;
  } catch (error) {
    return false;
  }
}

/** Mark invoices that older than 5 minutes as expired */
async function expireInvoices() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

  await prisma.bet.updateMany({
    where: {
      status: BetStatus.PENDING,
      createAt: {
        lt: fiveMinutesAgo,
      },
    },
    data: {
      status: BetStatus.EXPIRED,
    },
  });
}
