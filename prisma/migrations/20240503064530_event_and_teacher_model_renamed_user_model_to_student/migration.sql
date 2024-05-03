/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(255) NULL,
    `lastName` VARCHAR(255) NULL,
    `userName` VARCHAR(255) NULL,
    `usn` VARCHAR(10) NULL,
    `deptartment` VARCHAR(191) NULL,
    `semister` INTEGER NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `sessionId` VARCHAR(255) NULL,
    `isEmailVerified` BOOLEAN NULL DEFAULT false,
    `isStudentOrganizer` BOOLEAN NULL DEFAULT false,
    `otp` VARCHAR(45) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Student_userName_key`(`userName`),
    UNIQUE INDEX `Student_usn_key`(`usn`),
    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `categoryType` VARCHAR(191) NULL,
    `description` VARCHAR(500) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `duration` INTEGER NULL,
    `location` VARCHAR(191) NULL,
    `locationDetails` VARCHAR(191) NULL,
    `dateOfEvent` DATETIME(3) NULL,
    `freeEvent` BOOLEAN NULL,
    `amount` INTEGER NULL,
    `totalParticipants` MEDIUMINT NULL,
    `perTeamParticipants` TINYINT NULL,
    `studentOrganizerHead` VARCHAR(191) NULL,
    `teacherCoordinator` VARCHAR(191) NULL,
    `requirements` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Title`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `teacherId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NULL,
    `sessionId` VARCHAR(255) NULL,
    `isEmailVerified` BOOLEAN NULL DEFAULT false,
    `otp` VARCHAR(45) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Teacher_teacherId_key`(`teacherId`),
    UNIQUE INDEX `Teacher_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_studentOrganizerHead_fkey` FOREIGN KEY (`studentOrganizerHead`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_teacherCoordinator_fkey` FOREIGN KEY (`teacherCoordinator`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
