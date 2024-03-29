/*
  Warnings:

  - Added the required column `size` to the `VideoDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VideoDetails` ADD COLUMN `size` INTEGER NOT NULL;
