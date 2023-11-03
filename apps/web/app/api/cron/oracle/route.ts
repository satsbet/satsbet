import { setBTCLastPrice } from "@/app/actions";
import { GET } from "../settlement/route";

export async function POST(request: Request) {
  const { price } = await request.json();
  await setBTCLastPrice(price);
  return await GET();
}
