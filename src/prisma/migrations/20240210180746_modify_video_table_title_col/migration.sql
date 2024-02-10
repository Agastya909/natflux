/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `VideoDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `title` ON `VideoDetails`(`title`);
