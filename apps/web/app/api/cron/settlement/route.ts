import { prisma } from "@/utils/prisma";
import { BetStatus } from "@prisma/client";
import { lnbits } from "@/utils/lnbits";

import { runSettlement } from "../../../settlement";

export async function GET() {
  await runSettlement();
  return Response.json({ dispatched: true });
}
