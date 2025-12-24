-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'password',
    "bio" TEXT,
    "module" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "seoLevel" TEXT,
    "goals" TEXT,
    "passwordSet" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Student" ("bio", "credits", "email", "id", "module", "name", "password") SELECT "bio", "credits", "email", "id", "module", "name", "password" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
