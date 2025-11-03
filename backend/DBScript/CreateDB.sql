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
                                card_photo_id varchar(50) NOT NULL,
                                reject_reason VARCHAR(200)
);

DROP TABLE IF EXISTS validation_code CASCADE;
CREATE TABLE validation_code(
                                id SERIAL PRIMARY KEY,
                                code_hash VARCHAR(100) NOT NULL,
                                expires_at DATE NOT NULL,
                                attempts INTEGER NOT NULL DEFAULT 0
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
                        photo_path VARCHAR(100),
                        national_registry VARCHAR(20) UNIQUE,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        id_role INTEGER NOT NULL REFERENCES member_role(id),
                        id_member_2fa INTEGER REFERENCES member_2fa(id),
                        id_member_id_check INTEGER REFERENCES member_id_check(id),
                        id_validation_code INTEGER REFERENCES validation_code(id)
);

INSERT INTO member (first_name, last_name, email, password, address, birthday, national_registry, id_role)
VALUES ('root', 'root', 'root@root.com', '$argon2id$v=19$m=65536,t=3,p=4$GWApmfpjEMd9wlCVh5+qMw$Ijmzcn32ghNg2Ntmu0Ev/Qk3qs+UI0ENdQFgJBXj59w', 'root', '2000-01-01', '000000-000-00', 1); --password

DROP TABLE IF EXISTS type_danger CASCADE;
CREATE TABLE type_danger(
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL ,
                            is_used BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO type_danger (name, is_used)
VALUES('jeanbon', true);

DROP TABLE IF EXISTS report CASCADE;
CREATE TABLE report(
                       id SERIAL PRIMARY KEY,
                       date DATE NOT NULL,
                       location POINT NOT NULL,
                       level INTEGER NOT NULL,
                       photo_path varchar(100),
                       id_member INTEGER NOT NULL REFERENCES member(id),
                       id_type_danger INTEGER NOT NULL  REFERENCES type_danger(id)
);

DROP TABLE IF EXISTS team CASCADE;
CREATE TABLE team(
                             id SERIAL PRIMARY KEY,
                             name varchar(50) NOT NULL,
                             id_admin INTEGER NOT NULL REFERENCES member(id),
                             id_report INTEGER REFERENCES report(id)

);

DROP TABLE IF EXISTS team_member CASCADE;
CREATE TABLE team_member(
                            id SERIAL PRIMARY KEY,
                            accepted BOOLEAN NOT NULL DEFAULT FALSE,
                            id_team INTEGER NOT NULL REFERENCES team_member(id),
                            id_member INTEGER NOT NULL REFERENCES member(id)
);
