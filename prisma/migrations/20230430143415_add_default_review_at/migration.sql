-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JapaneseCardSide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nextReviewAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JapaneseCardSide_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JapaneseCardSide" ("cardId", "createdAt", "id", "nextReviewAt", "updatedAt") SELECT "cardId", "createdAt", "id", "nextReviewAt", "updatedAt" FROM "JapaneseCardSide";
DROP TABLE "JapaneseCardSide";
ALTER TABLE "new_JapaneseCardSide" RENAME TO "JapaneseCardSide";
CREATE UNIQUE INDEX "JapaneseCardSide_cardId_key" ON "JapaneseCardSide"("cardId");
CREATE TABLE "new_EnglishCardSide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nextReviewAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnglishCardSide_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnglishCardSide" ("cardId", "createdAt", "id", "nextReviewAt", "updatedAt") SELECT "cardId", "createdAt", "id", "nextReviewAt", "updatedAt" FROM "EnglishCardSide";
DROP TABLE "EnglishCardSide";
ALTER TABLE "new_EnglishCardSide" RENAME TO "EnglishCardSide";
CREATE UNIQUE INDEX "EnglishCardSide_cardId_key" ON "EnglishCardSide"("cardId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
