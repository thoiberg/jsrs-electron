-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JapaneseCardSide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nextReviewAt" DATETIME NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JapaneseCardSide_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JapaneseAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kanji" TEXT,
    "kana" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "japaneseCardSideId" TEXT NOT NULL,
    CONSTRAINT "JapaneseAnswer_japaneseCardSideId_fkey" FOREIGN KEY ("japaneseCardSideId") REFERENCES "JapaneseCardSide" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnglishCardSide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nextReviewAt" DATETIME NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnglishCardSide_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnglishAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "englishCardSideId" TEXT NOT NULL,
    CONSTRAINT "EnglishAnswer_englishCardSideId_fkey" FOREIGN KEY ("englishCardSideId") REFERENCES "EnglishCardSide" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "JapaneseCardSide_cardId_key" ON "JapaneseCardSide"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "JapaneseAnswer_japaneseCardSideId_key" ON "JapaneseAnswer"("japaneseCardSideId");

-- CreateIndex
CREATE UNIQUE INDEX "EnglishCardSide_cardId_key" ON "EnglishCardSide"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "EnglishAnswer_englishCardSideId_key" ON "EnglishAnswer"("englishCardSideId");
