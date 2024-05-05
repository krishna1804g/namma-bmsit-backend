/*
  Warnings:

  - You are about to drop the column `deptartment` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `semister` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `deptartment`,
    DROP COLUMN `semister`,
    ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `semester` INTEGER NULL;
