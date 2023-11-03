"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { pusherClient } from "@/utils/pusher.client";
import { Bet, BetStatus } from "@prisma/client";

export function PaymentFlow({
  listenTo,
  initialStatus,
  views,
}: {
  listenTo: Bet["id"];
  initialStatus: Bet["status"];
  views: Record<BetStatus, React.JSX.Element>;
}) {
  const [status, setStatus] = useState<BetStatus>(initialStatus);

  useEffect(() => {
    const onPaymentSucceeded = () => {
      setStatus("PAID");
    };

    pusherClient.subscribe(listenTo);
    pusherClient.bind("payment.succeeded", onPaymentSucceeded);

    return () => {
      // cleanup
      pusherClient.unsubscribe(listenTo);
      pusherClient.unbind("payment.succeeded", onPaymentSucceeded);
    };
  }, [listenTo]);

  return views[status];
}
