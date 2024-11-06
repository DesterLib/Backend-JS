/*
  Warnings:

  - A unique constraint covering the columns `[externalId,externalSource]` on the table `MediaItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MediaItem_externalId_externalSource_key" ON "MediaItem"("externalId", "externalSource");
