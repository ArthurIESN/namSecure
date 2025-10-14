/* Postgres -V 17.6 */
/* docker pull postgres:17.6-trixie */
/* docker run --name my-postgres-container \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v my-postgres-data:/var/lib/postgresql/data \
  -d postgres:17.6-trixie */

/* docker run my-postgres-container */

DROP TABLE IF EXISTS member_role CASCADE;
CREATE TABLE member_role(
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL
);

INSERT INTO member_role (name) VALUES ('admin'), ('member'), ('police');

DROP TABLE IF EXISTS member_2fa CASCADE;
CREATE TABLE member_2fa(
                           id SERIAL PRIMARY KEY,
                           secret_key varchar(100) NOT NULL,
                           is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS member_id_check CASCADE;
CREATE TABLE member_id_check(
                                id SERIAL PRIMARY KEY,
                                card_front_id varchar(50) NOT NULL,
                                card_back_id varchar(50) NOT NULL,
                                reject_reason VARCHAR(200)
);

DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member (
                        id SERIAL PRIMARY KEY,
                        first_name varchar(50),
                        last_name varchar(50),
                        email varchar(100) UNIQUE NOT NULL,
                        email_checked BOOLEAN NOT NULL DEFAULT FALSE,
                        id_checked BOOLEAN NOT NULL DEFAULT FALSE,
                        password VARCHAR(255) NOT NULL,
                        password_last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        address varchar(100) NOT NULL,
                        birthday DATE,
                        national_registry VARCHAR(20) UNIQUE,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        id_role INTEGER NOT NULL REFERENCES member_role(id),
                        id_member_2fa INTEGER REFERENCES member_2fa(id),
                        id_member_id_check INTEGER REFERENCES member_id_check(id)
);

INSERT INTO member (first_name, last_name, email, password, address, birthday, national_registry, id_role)
VALUES ('root', 'root', 'root@root.com', '$argon2id$v=19$m=65536,t=3,p=4$Zlt4ajEyoZ2T9JZeo6fqfQ$N3u7B55JfJti5sEKl0mYbKRRgid2bxzk1XYGbNVJjRk', 'root', '2000-01-01', '000000-000-00', 1); --password

DROP TABLE IF EXISTS team CASCADE;
CREATE TABLE team(
                             id SERIAL PRIMARY KEY,
                             id_admin INTEGER NOT NULL REFERENCES member(id),
                             name varchar(50) NOT NULL
);

DROP TABLE IF EXISTS team_member CASCADE;
CREATE TABLE team_member(
                             id SERIAL PRIMARY KEY,
                             id_team INTEGER NOT NULL REFERENCES team_member(id),
                             id_member INTEGER NOT NULL REFERENCES member(id)
);

DROP TABLE IF EXISTS type_danger CASCADE;
CREATE TABLE type_danger(
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL ,
                            is_used BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS report CASCADE;
CREATE TABLE report(
                       id SERIAL PRIMARY KEY,
                       date DATE NOT NULL,
                       description VARCHAR(200),
                       location POINT NOT NULL,
                       level INTEGER NOT NULL,
                       photo_id varchar(100),
                       id_type_danger INTEGER NOT NULL  REFERENCES type_danger(id)
);

DROP TABLE IF EXISTS member_report CASCADE;
CREATE TABLE member_report(
                              id SERIAL PRIMARY KEY,
                              id_member INTEGER NOT NULL REFERENCES member(id),
                              id_report INTEGER NOT NULL REFERENCES report(id)
);

DROP TABLE IF EXISTS validation_code CASCADE;
CREATE TABLE validation_code(
                                id SERIAL PRIMARY KEY,
                                code_hash VARCHAR(100) NOT NULL,
                                expires_at DATE NOT NULL,
                                attempts INTEGER NOT NULL DEFAULT 0,
                                id_member  INTEGER NOT NULL UNIQUE REFERENCES member(id)
);