-- Remove the empty migration from history
DELETE FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260214123749_AddMediaUrlToPost';

-- Add the MediaUrl column
ALTER TABLE "Posts" ADD COLUMN "MediaUrl" character varying(2000);

-- Re-insert the migration history entry
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260214123749_AddMediaUrlToPost', '10.0.0');
