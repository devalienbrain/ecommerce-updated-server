/*
  Warnings:

  - You are about to drop the column `userAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userPhone` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userAddress",
DROP COLUMN "userEmail",
DROP COLUMN "userName",
DROP COLUMN "userPhone";
