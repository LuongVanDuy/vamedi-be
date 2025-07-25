/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_PostTags` DROP FOREIGN KEY `_PostTags_B_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `newPerson` TINYINT NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `Tag`;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tag_name_key`(`name`),
    UNIQUE INDEX `tag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
