-- SEEDING POUR LA BDD okanban

BEGIN;

-- ON VIDE NOS TABLES
TRUNCATE "card_has_tag", "card", "tag", "list";

-- LIST
INSERT INTO "list" ("name")
VALUES ('première liste');

INSERT INTO "list" ("name", "position")
VALUES ('deuxième liste', 1);

-- CARD
INSERT INTO "card" ("content", "color", "position", "list_id") VALUES 
('première carte', '#FF0000', 0, 1),
('deuxème carte', '#00FF00', 1, 1),
('troisième carte', '#0000FF', 0, 2);

-- TAG
INSERT INTO "tag" ("name", "color") VALUES 
('urgent', '#FF0000'),
('facile', '#00FF00');

-- CARD_HAS_TAG
INSERT INTO "card_has_tag" ("card_id", "tag_id") VALUES 
(1, 1),
(1, 2),
(2, 1),
(3, 2);

COMMIT;