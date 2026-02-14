START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260214123749_AddMediaUrlToPost') THEN
    ALTER TABLE "Posts" ADD "MediaUrl" character varying(2000);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260214123749_AddMediaUrlToPost') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260214123749_AddMediaUrlToPost', '10.0.0');
    END IF;
END $EF$;
COMMIT;

