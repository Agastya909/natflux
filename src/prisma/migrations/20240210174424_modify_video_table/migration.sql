/*
  Warnings:

  - Added the required column `path` to the `VideoDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VideoDetails` ADD COLUMN `path` VARCHAR(1024) NOT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;
