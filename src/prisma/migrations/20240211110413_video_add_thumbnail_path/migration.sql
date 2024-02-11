/*
  Warnings:

  - Added the required column `thumbnail_path` to the `VideoDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VideoDetails` ADD COLUMN `thumbnail_path` VARCHAR(1024) NOT NULL;
