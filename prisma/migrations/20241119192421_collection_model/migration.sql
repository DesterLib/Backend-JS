/*
  Warnings:

  - A unique constraint covering the columns `[externalId,externalSource]` on the table `BaseMedia` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `provider` on the `ApiService` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mediaType` on the `BaseMedia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `externalSource` on the `BaseMedia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fileType` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mediaType` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ApiService" DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BaseMedia" DROP COLUMN "mediaType",
ADD COLUMN     "mediaType" TEXT NOT NULL,
DROP COLUMN "externalSource",
ADD COLUMN     "externalSource" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileType",
ADD COLUMN     "fileType" TEXT NOT NULL,
DROP COLUMN "mediaType",
ADD COLUMN     "mediaType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ExternalSource";

-- DropEnum
DROP TYPE "FileType";

-- DropEnum
DROP TYPE "MediaType";

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiService_provider_apiKey_key" ON "ApiService"("provider", "apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "BaseMedia_externalId_externalSource_key" ON "BaseMedia"("externalId", "externalSource");
