/*
  Warnings:

  - Added the required column `uploader_id` to the `VideoDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VideoDetails` ADD COLUMN `uploader_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `VideoDetails` ADD CONSTRAINT `VideoDetails_uploader_id_fkey` FOREIGN KEY (`uploader_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
