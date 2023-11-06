import { useCurrencyFormatter } from "../hooks/use-currency-formatter";
import { PlaceBetForm } from "./place-bet-form";
import { getLastQuote, getMultiplier } from "./loader";
import dynamic from "next/dynamic";

const DynamicCountdown = dynamic(() => import("./CountdownHome"), {
  ssr: false,
  loading: () => <>...</>,
});

export const revalidate = 60;

export default async function Home() {
  const lastQuote = await getLastQuote();
  const multiplier = await getMultiplier();
  const { format } = useCurrencyFormatter();

  return (
    <div className="max-w-lg mx-auto">
      <p
        className="font-medium mb-4 text-center"
        style={{
          // @ts-expect-error
          textWrap: "balance",
        }}
      >
        Bet which direction Bitcoin price will go in the next hours. If you are
        correct, you will multiply your buy-in!{" "}
      </p>

      <div className="border border-gray-100 rounded p-4 bg-gray-50 mb-4">
        Yesterday price: {lastQuote && format(lastQuote.price / 100)}
      </div>

      <PlaceBetForm {...multiplier} />

      <div className="border border-gray-100 rounded p-4 bg-gray-50 mt-4">
        Bets end at <DynamicCountdown />
      </div>
    </div>
  );
}
