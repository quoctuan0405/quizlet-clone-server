/*
  Warnings:

  - Added the required column `confirmToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "option" SET DATA TYPE VARCHAR(2047);

-- AlterTable
ALTER TABLE "Term" ALTER COLUMN "question" SET DATA TYPE VARCHAR(2047),
ALTER COLUMN "answer" SET DATA TYPE VARCHAR(2047),
ALTER COLUMN "explanation" SET DATA TYPE VARCHAR(2047);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmToken" VARCHAR(255) NOT NULL;
