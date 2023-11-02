// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_PRISMA_URL: z.string().url(),
    DATABASE_URL_NON_POOLING: z.string().url(),
    LNBITS_ENDPOINT: z.string().url(),
    LNBITS_ADMIN_KEY: z.string(),
    LNBITS_INVOICE_READ_KEY: z.string(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {},
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_PRISMA_URL: process.env.DATABASE_PRISMA_URL,
    DATABASE_URL_NON_POOLING: process.env.DATABASE_URL_NON_POOLING,
    LNBITS_ENDPOINT: process.env.LNBITS_ENDPOINT,
    LNBITS_ADMIN_KEY: process.env.LNBITS_ADMIN_KEY,
    LNBITS_INVOICE_READ_KEY: process.env.LNBITS_INVOICE_READ_KEY,
  },
});
