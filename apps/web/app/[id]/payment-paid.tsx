import React from "react";

export default function PaymentPaid() {
  return (
    <div className="max-w-lg mx-auto py-6 md:p-6 md:border-2 md:border-input-lg rounded gap-4 flex flex-col">
      <h1 className="text-2xl font-bold">
        That's what we call{" "}
        <span className="underline">put your sats where your mouth is</span>!
      </h1>

      <p>
        We are all set! When the bet is over, we send outs payments
        automatically to the winners.
      </p>

      <p></p>
      <p>Thanks for participating!</p>
    </div>
  );
}
