/*
  Warnings:

  - You are about to alter the column `tokenExpiration` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "isConfirm" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "tokenExpiration" DATETIME
);
INSERT INTO "new_User" ("admin", "createdAt", "email", "id", "isConfirm", "name", "password", "token", "tokenExpiration") SELECT "admin", "createdAt", "email", "id", "isConfirm", "name", "password", "token", "tokenExpiration" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
