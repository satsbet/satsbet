import { prisma } from "@/utils/prisma";
import { useCurrencyFormatter } from "../hooks/use-currency-formatter";
import { PlaceBetForm } from "./place-bet-form";

/** Show the price from yesterday's btc */
async function getLastQuote() {
  return prisma.quote.findFirst({
    orderBy: {
      day: "desc",
    },
  });
}

export default async function Home() {
  const lastQuote = await getLastQuote();
  const { format } = useCurrencyFormatter();

  return (
    <div>
      Last quote: {lastQuote && format(lastQuote.price / 100)}
      <PlaceBetForm />
    </div>
  );
}
