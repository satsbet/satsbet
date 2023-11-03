import React from "react";
import { notFound } from "next/navigation";

import { PaymentFlow } from "./payment-flow";
import { PaymentPending } from "./payment-pending";
import { prisma } from "@/utils/prisma";

export default async function DonationStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const bet = await prisma.bet.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!bet) {
    notFound();
  }

  return (
    <div className="">
      <PaymentFlow
        initialStatus={bet.status}
        listenTo={bet.id}
        views={{
          PENDING: <PaymentPending {...bet} />,
          PAID: <>succeeded</>,
          EXPIRED: <>expired</>,
          LOST: <>lost</>,
          PROBLEM: <>problem</>,
          REFUNDED: <>refunded</>,
          WIN: <>win</>,
        }}
      />
    </div>
  );
}
