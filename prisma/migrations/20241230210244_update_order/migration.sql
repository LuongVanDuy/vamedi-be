-- AlterTable
ALTER TABLE `order` ADD COLUMN `add_on_service` TEXT NULL,
    ADD COLUMN `style_detail` VARCHAR(255) NULL,
    ADD COLUMN `sub_service` VARCHAR(255) NULL;
