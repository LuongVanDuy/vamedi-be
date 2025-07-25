/*
  Warnings:

  - You are about to drop the column `newPerson` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `newPerson`,
    ADD COLUMN `new_person` TINYINT NOT NULL DEFAULT 1;
