import React from "react";
import type { Bet, BetTarget } from "@prisma/client";
import { QR } from "react-qr-rounded";
import { Copyable } from "./copyable";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { EXPIRATION_TIME } from "../constants";

function getMarketMoodSentence(trend: BetTarget): string {
  const sentences = {
    UP: [
      "You're mining optimism in the Bitcoin boom!",
      "Sailing smoothly on the Bitcoin bullish tide, aren't you?",
      "Your digital wallet must be glowing with all that bullish Bitcoin energy!",
      "Hodling strong for that Bitcoin moonshot, I see!",
      "You’ve got the golden key to the Bitcoin bull run!",
      "With every block, your bullish spirit for Bitcoin shines brighter!",
      "Looks like you're the captain of the Bitcoin bull brigade!",
      "You're stacking sats and bullish bets with confidence!",
      "Bullish on Bitcoin? You're riding the virtual wave of the future!",
      "In the Bitcoin bull market, your strategy is pure gold!",
    ],
    DOWN: [
      "Bracing for a Bitcoin winter, you’ve got your strategy on ice!",
      "Bearish on Bitcoin, ready for the market correction roller coaster!",
      "You're playing it cool in the shade of the Bitcoin bear market!",
      "Navigating the Bitcoin bear market with a steady hand at the helm!",
      "Betting on a Bitcoin downturn? Your foresight might be spot on!",
      "Your bearish stance on Bitcoin is as solid as a blockchain!",
      "In the ebb and flow of Bitcoin, you’re predicting a low tide!",
      "Preparing your portfolio for a bearish Bitcoin season, you're not fooled by the hype!",
      "With Bitcoin's volatility, your bearish bet could be a smooth move!",
      "You’re watching the Bitcoin market with a bearish eagle eye!",
    ],
  };

  // Get a random sentence from the appropriate set
  const randomIndex = Math.floor(Math.random() * sentences[trend].length);
  return sentences[trend][randomIndex];
}

export async function PaymentPending(props: Bet) {
  const { id, invoiceRequestHash, target, createAt } = props;
  const time = new Date(createAt.toISOString());
  time.setUTCSeconds(time.getUTCSeconds() + EXPIRATION_TIME / 1000);

  return (
    <div className="max-w-lg mx-auto py-6 md:p-6 md:border-2 md:border-input-lg rounded gap-4 flex flex-col">
      <h1
        className="text-xl md:text-4xl font-extrabold"
        style={{
          // @ts-expect-error
          textWrap: "balance",
        }}
      >
        {getMarketMoodSentence(target)}
      </h1>

      <p>Please pay the following invoice to participate on the bet.</p>

      <div className="flex flex-col md:flex-row gap-4">
        <QR
          className="w-1/2 hidden sm:block"
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
        <div className="flex md:w-1/2 flex-col gap-4">
          <Button asChild>
            <a href={`lightning:${invoiceRequestHash}`}>
              <Zap className="mr-2 h-4 w-4" /> Pay Invoice{" "}
            </a>
          </Button>

          <div className="">
            <Label>Invoice #</Label>
            <Copyable text={invoiceRequestHash} />
          </div>

          <div className="">
            <Label>Invoice expire in</Label>
            <div className="text-foreground text-sm">
              <Countdown expiryTimestamp={time} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Label>Bet #</Label>
        <div className="text-2xl font-bold">{id}</div>
        <div className="text-xs">
          Make sure to save this number, you'll need it to check the results of
          the bet.
        </div>
      </div>
    </div>
  );
}
