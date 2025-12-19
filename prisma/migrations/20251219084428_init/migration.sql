-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `HotelName` VARCHAR(191) NOT NULL,
    `UserName` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `Role` VARCHAR(191) NOT NULL,
    `LogoUrl` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_UserName_key`(`UserName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
