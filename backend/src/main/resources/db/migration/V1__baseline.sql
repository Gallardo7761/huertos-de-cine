CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS huertos_de_cine;

CREATE TYPE core.role_type AS ENUM ('USER', 'ADMIN');
CREATE TYPE core.status_type AS ENUM ('INACTIVE', 'ACTIVE');
CREATE TYPE huertos_de_cine.role_type AS ENUM ('USER', 'ADMIN');

CREATE FUNCTION core.fn_update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TABLE core.users (
    sub                varchar(255) PRIMARY KEY,
    name               varchar(256) NOT NULL,
    given_name         varchar(128),
    family_name        varchar(128),
    preferred_username varchar(64) UNIQUE,
    picture            varchar(512),
    email              varchar(256) NOT NULL UNIQUE,
    email_verified     boolean NOT NULL DEFAULT false,
    global_role        core.role_type NOT NULL DEFAULT 'USER',
    global_status      core.status_type NOT NULL DEFAULT 'ACTIVE',
    created_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER tr_update_users_updated_at
    BEFORE UPDATE ON core.users
    FOR EACH ROW EXECUTE FUNCTION core.fn_update_updated_at_column();

CREATE TABLE huertos_de_cine.cine_movies (
    movie_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title       varchar(64) NOT NULL,
    description text NOT NULL,
    cover       varchar(512) NOT NULL
);

CREATE TABLE huertos_de_cine.cine_user_metadata (
    user_id        varchar(255) PRIMARY KEY REFERENCES core.users (sub) ON DELETE CASCADE,
    role           huertos_de_cine.role_type NOT NULL DEFAULT 'USER',
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deactivated_at timestamp
);

CREATE TABLE huertos_de_cine.cine_votes (
    user_id    varchar(255) NOT NULL REFERENCES core.users (sub) ON DELETE CASCADE,
    movie_id   uuid NOT NULL REFERENCES huertos_de_cine.cine_movies (movie_id) ON DELETE CASCADE,
    vote       smallint NOT NULL CHECK (vote IN (-1, 1)),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id)
);
