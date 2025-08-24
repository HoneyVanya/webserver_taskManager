-- Task 1: Select all columns (*) from the "User" table.
-- Note: Prisma creates tables with capital letters, so in PostgreSQL,
-- you must wrap the table name in double quotes to preserve the case.
SELECT * FROM "User";
SELECT * FROM "Task";

-- Task 2: Insert a new user.
-- We must specify the columns we are providing data for.
-- Note: We have to provide the 'id' ourselves because we are not using Prisma's default.
INSERT INTO "User" ("id", "email", "username", "password", "updatedAt", "createdAt")
VALUES ('cuid_for_practice_123', 'raw-sql@example.com', 'SQL User', 'dummy-password', NOW(), NOW());

-- Task 3: Change the username of the user we just created.
-- The WHERE clause is CRITICAL. It specifies WHICH row to update.
-- Without it, you would update EVERY user in the table.
UPDATE "User"
SET "username" = 'Raw SQL Power User'
WHERE "email" = 'raw-sql@example.com';

-- Task 4: Delete the user we created.
-- The WHERE clause is the most important part of a DELETE statement.
DELETE FROM "User"
WHERE "email" = 'raw-sql@example.com';
-- Run your `SELECT` query one last time. The user will be gone.


-- Task 1: INNER JOIN
-- Select specific columns from both tables
SELECT
    "Task"."title",         -- Get the 'title' column from the "Task" table
    "User"."email"          -- Get the 'email' column from the "User" table
FROM
    "Task"                  -- Start with the "Task" table
INNER JOIN                  -- Specify the join type
    "User"                  -- The table we want to join with
ON
    "Task"."authorId" = "User"."id"; -- This is the CRITICAL join condition.
                                    -- "Match the rows where the Task's authorId
                                    -- is equal to the User's id."


-- Task 2: JOIN with WHERE
SELECT
    "Task"."title",
    "Task"."completed",
    "User"."username"
FROM
    "Task"
INNER JOIN
    "User" ON "Task"."authorId" = "User"."id"
WHERE
    "User"."email" = 'test@example.com'; -- Filter the COMBINED result

    -- Task 3: LEFT JOIN
-- Notice the order of the tables is now User first (the "left" table)
SELECT
    "Task"."title",
    "User"."username"
FROM
    "Task"
LEFT JOIN
    "User" ON "Task"."authorId" = "User"."id";



SELECT "id", "email" FROM "User";

INSERT INTO "Task" ("id", "title", "authorId", "updatedAt", "createdAt")
VALUES ('cuid_for_task_2', 'Sobachi Dela', 'cmby5rt18000031mov8d04zqm', NOW(), NOW());

INSERT INTO "Task" ("id", "title", "completed", "createdAt", "updatedAt", "authorId")
VALUES ('task_ludi', 'Ludskie Dela', 'True', NOW(), NOW(), 'cmby5rt18000031mov8d04zqm');

UPDATE "User"
SET "username" = 'Nikolay Horn'
WHERE "email" = 'sobakaNeMoya@mail.com';