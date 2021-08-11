/*
  Warnings:

  - Added the required column `learned` to the `UserLearningTerm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserLearningTerm" ADD COLUMN     "learned" BOOLEAN NOT NULL;
