/*
  Warnings:

  - You are about to drop the column `paymentHash` on the `Bet` table. All the data in the column will be lost.
  - Added the required column `invoicePaymentHash` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceRequestHash` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "paymentHash",
ADD COLUMN     "invoicePaymentHash" TEXT NOT NULL,
ADD COLUMN     "invoiceRequestHash" TEXT NOT NULL;
