/*
  Warnings:

  - A unique constraint covering the columns `[basePath]` on the table `BaseMedia` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `provider` on the `ApiService` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `externalId` to the `BaseMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalSource` to the `BaseMedia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExternalSource" AS ENUM ('TMDB', 'ANILIST');

-- AlterTable
ALTER TABLE "ApiService" DROP COLUMN "provider",
ADD COLUMN     "provider" "ExternalSource" NOT NULL;

-- AlterTable
ALTER TABLE "BaseMedia" ADD COLUMN     "externalId" INTEGER NOT NULL,
ADD COLUMN     "externalSource" "ExternalSource" NOT NULL;

-- DropEnum
DROP TYPE "ApiServiceProvider";

-- CreateIndex
CREATE UNIQUE INDEX "ApiService_provider_apiKey_key" ON "ApiService"("provider", "apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "BaseMedia_basePath_key" ON "BaseMedia"("basePath");
