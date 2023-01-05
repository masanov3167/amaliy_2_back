-- 1) databaza yaratmiz
CREATE DATABASE masanov;

-- 2) databazaga kiramiz
\c masanov;

-- 3) db_users nomli table ochamiz
DROP TABLE IF EXISTS db_users;
CREATE TABLE db_users (      
	id serial PRIMARY KEY, 
    name text not null, 
    parol text not null,
    pic text not null
);