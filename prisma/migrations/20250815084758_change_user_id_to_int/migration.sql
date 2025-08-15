/*
  Warnings:

  - You are about to drop the column `screenId` on the `PlaylistItem` table. All the data in the column will be lost.
  - You are about to drop the `auditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PlaylistItem" DROP CONSTRAINT "PlaylistItem_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlaylistItem" DROP CONSTRAINT "PlaylistItem_screenId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Setting" DROP CONSTRAINT "Setting_screenId_fkey";

-- DropForeignKey
ALTER TABLE "public"."auditLog" DROP CONSTRAINT "auditLog_userId_fkey";

-- AlterTable
ALTER TABLE "public"."PlaylistItem" DROP COLUMN "screenId",
ALTER COLUMN "mediaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Screen" ADD COLUMN     "playlistId" INTEGER;

-- DropTable
DROP TABLE "public"."auditLog";

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "request" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "error" TEXT,
    "status" INTEGER NOT NULL,
    "lineNumber" INTEGER,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Setting" ADD CONSTRAINT "Setting_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Screen" ADD CONSTRAINT "Screen_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
