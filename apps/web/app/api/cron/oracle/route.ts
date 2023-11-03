import { setBTCLastPrice } from "@/app/actions";

export async function POST(request: Request) {
  const { price } = await request.json();
  await setBTCLastPrice(price);
  return Response.json({ ok: true, price });
}
