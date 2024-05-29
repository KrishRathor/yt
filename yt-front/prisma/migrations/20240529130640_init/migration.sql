-- AlterTable
CREATE SEQUENCE playlistitem_position_seq;
ALTER TABLE "PlaylistItem" ALTER COLUMN "position" SET DEFAULT nextval('playlistitem_position_seq');
ALTER SEQUENCE playlistitem_position_seq OWNED BY "PlaylistItem"."position";
