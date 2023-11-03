import { useCurrencyFormatter } from "../hooks/use-currency-formatter";
import { PlaceBetForm } from "./place-bet-form";
import { getLastQuote, getMultiplier } from "./loader";
import dynamic from "next/dynamic";

const DynamicCountdown = dynamic(() => import("./CountdownHome"), {
  ssr: false,
  loading: () => <>...</>,
});

export default async function Home() {
  const lastQuote = await getLastQuote();
  const multiplier = await getMultiplier();
  const { format } = useCurrencyFormatter();

  return (
    <div>
      Last quote: {lastQuote && format(lastQuote.price / 100)}
      <br />
      Multiplier: {JSON.stringify(multiplier)}
      <div className="">
        Bets end at <DynamicCountdown />
      </div>
      <PlaceBetForm />
    </div>
  );
}
