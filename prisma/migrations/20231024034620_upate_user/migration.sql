/*
  Warnings:

  - Made the column `mobile` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `mobile` VARCHAR(191) NOT NULL;
