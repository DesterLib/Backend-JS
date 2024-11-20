/*
  Warnings:

  - You are about to drop the column `mediaId` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_mediaId_mediaType_idx";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "mediaId";
