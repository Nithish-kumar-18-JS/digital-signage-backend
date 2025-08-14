-- AlterTable
ALTER TABLE "public"."PlaylistItem" ADD COLUMN     "screenId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
