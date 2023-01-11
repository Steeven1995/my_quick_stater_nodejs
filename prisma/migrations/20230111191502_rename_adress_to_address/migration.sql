/*
  Warnings:

  - You are about to drop the column `adress` on the `Company` table. All the data in the column will be lost.
  - Added the required column `address` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo_public_id" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bp" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("bp", "city", "country", "description", "id", "logo_public_id", "logo_url", "name", "ownerId") SELECT "bp", "city", "country", "description", "id", "logo_public_id", "logo_url", "name", "ownerId" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_ownerId_key" ON "Company"("ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
