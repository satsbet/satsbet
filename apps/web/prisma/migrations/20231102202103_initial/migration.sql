-- CreateEnum
CREATE TYPE "BetTarget" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'WIN', 'LOSE', 'REFUNDED', 'PROBLEM');

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" BIGINT NOT NULL,
    "email" TEXT,
    "lnAddress" TEXT NOT NULL,
    "target" "BetTarget" NOT NULL,
    "status" "BetStatus" NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_day_key" ON "Quote"("day");
