import { setBTCLastPrice } from "@/app/actions";
import { GET } from "../settlement/route";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { price } = await request.json();
  await setBTCLastPrice(price);
  return await GET();
}
