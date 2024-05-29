/*
  Warnings:

  - Added the required column `channelId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "channelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
