/* CREATION DE LA STRUCTURE DE LA BDD OKANBAN */

-- ON COMMENCE UNE TRANSACTION
BEGIN;

-- on commence par supprimer les tables à créer si jamais elles existent
DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";
DROP SEQUENCE IF EXISTS "card_id_seq", "list_id_seq", "tag_id_seq";

CREATE TABLE "list" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0, -- si on ne précise pas de valeur pour ce champ à l'insertion, 0 sera utilisé.
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "content" TEXT NOT NULL,
  "color" TEXT,
  "position" INTEGER NOT NULL DEFAULT 0, -- si on ne précise pas de valeur pour ce champ à l'insertion, 0 sera utilisé.
  "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "tag" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "color" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card_has_tag" (
  "card_id" INTEGER NOT NULL REFERENCES "card"("id")  ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES "tag"("id")  ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("card_id", "tag_id")
);

-- ON FINALISE LA TRANSACTION
-- SI JAMAIS QUELQUE CHOSE SE PASSE MAL ENTRE LE BEGIN ET LE COMMIT
-- LA BDD REVIENT DANS L'ETAT QU'ELLE AVAIT AVANT LE BEGIN
COMMIT;

