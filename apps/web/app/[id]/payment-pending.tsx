import React from "react";
import type { Bet } from "@prisma/client";
import { QR } from "react-qr-rounded";

export async function PaymentPending(props: Bet) {
  const { invoiceRequestHash } = props;

  return (
    <div>
      <QR
        className="h-64 w-64 p-4"
        rounding={100}
        // cutout
        // cutoutElement={
        //   <img
        //     src="https://random.imagecdn.app/500/500"
        //     style={{
        //       objectFit: "contain",
        //       width: "100%",
        //       height: "100%",
        //     }}
        //   />
        // }
        errorCorrectionLevel="H"
      >
        {invoiceRequestHash}
      </QR>
      <pre>{invoiceRequestHash}</pre>
    </div>
  );
}
