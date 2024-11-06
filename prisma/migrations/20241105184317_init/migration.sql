-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TVSHOW');

-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('FAVOURITES', 'WATCHLIST', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('ALLOWED', 'DISALLOWED');

-- CreateTable
CREATE TABLE "MediaFolderCollection" (
    "id" TEXT NOT NULL,

    CONSTRAINT "MediaFolderCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalSource" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "poster" TEXT,
    "backdrop" TEXT,
    "mediaFolderCollectionId" TEXT,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListUserAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaItemId" TEXT,
    "listId" TEXT,
    "mediaFolderCollectionId" TEXT,
    "accessType" "AccessType" NOT NULL,

    CONSTRAINT "ListUserAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "isChild" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListUserAccess_userId_mediaItemId_key" ON "ListUserAccess"("userId", "mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ListUserAccess_userId_listId_key" ON "ListUserAccess"("userId", "listId");

-- CreateIndex
CREATE UNIQUE INDEX "ListUserAccess_userId_mediaFolderCollectionId_key" ON "ListUserAccess"("userId", "mediaFolderCollectionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_mediaFolderCollectionId_fkey" FOREIGN KEY ("mediaFolderCollectionId") REFERENCES "MediaFolderCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListUserAccess" ADD CONSTRAINT "ListUserAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListUserAccess" ADD CONSTRAINT "ListUserAccess_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListUserAccess" ADD CONSTRAINT "ListUserAccess_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListUserAccess" ADD CONSTRAINT "ListUserAccess_mediaFolderCollectionId_fkey" FOREIGN KEY ("mediaFolderCollectionId") REFERENCES "MediaFolderCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
