-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_super_admin` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(20) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `password` VARCHAR(72) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NULL,
    `phone` VARCHAR(15) NULL,
    `avatar` VARCHAR(255) NULL,
    `verified` TINYINT NULL DEFAULT 0,
    `company_name` VARCHAR(255) NULL,
    `company_url` VARCHAR(255) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `delete_flg` TINYINT NULL DEFAULT 0,
    `created_user` INTEGER NULL,
    `updated_user` INTEGER NULL,
    `created_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_delete_flg_idx`(`delete_flg`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrators` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `delete_flg` TINYINT NULL DEFAULT 0,
    `created_user` INTEGER NULL,
    `updated_user` INTEGER NULL,
    `created_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_verify` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(320) NOT NULL,
    `verify_token` VARCHAR(256) NULL,

    UNIQUE INDEX `email_verify_email_key`(`email`),
    UNIQUE INDEX `email_verify_verify_token_key`(`verify_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `thumbnail` VARCHAR(255) NULL,
    `author_id` INTEGER NOT NULL,
    `delete_flg` TINYINT NULL DEFAULT 0,
    `created_user` INTEGER NULL,
    `updated_user` INTEGER NULL,
    `created_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `post_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    UNIQUE INDEX `Tag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_name` VARCHAR(255) NOT NULL,
    `service` VARCHAR(255) NOT NULL,
    `upload_image` VARCHAR(255) NULL,
    `design_style` VARCHAR(191) NULL,
    `photo_detail` VARCHAR(191) NULL,
    `customer_id` INTEGER NOT NULL,
    `service_price` DOUBLE NOT NULL,
    `additional_service` VARCHAR(191) NULL,
    `additional_service_price` DOUBLE NULL,
    `order_total` DOUBLE NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_user` INTEGER NULL,
    `updated_user` INTEGER NULL,
    `created_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PostTags_AB_unique`(`A`, `B`),
    INDEX `_PostTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `administrators` ADD CONSTRAINT `administrators_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
