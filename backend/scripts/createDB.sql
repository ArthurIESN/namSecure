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
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
                        apple_id VARCHAR(100) UNIQUE,
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

INSERT INTO member (first_name, last_name, email, password, address, birthday, national_registry, id_role, email_checked, id_checked)
VALUES ('root', 'root', 'root@root.com', '$argon2id$v=19$m=19456,t=2,p=1$hTNOkj8jWws8MWdHFj6GoA$s41XpdWq1QVPPKOu9jomE52qexww7mcCjjgKwIKfnAE', 'root', '2000-01-01', '000000-000-01', 1, true, true); --test

-- Add 2 new test users with admin role
INSERT INTO member (first_name, last_name, email, password, address, birthday, national_registry, id_role, email_checked, id_checked)
VALUES ('Test', 'User1', 'test@test.com', '$argon2id$v=19$m=19456,t=2,p=1$hTNOkj8jWws8MWdHFj6GoA$s41XpdWq1QVPPKOu9jomE52qexww7mcCjjgKwIKfnAE', 'Test Address', '2000-01-01', '000000-000-02', 1, true, true);

INSERT INTO member (first_name, last_name, email, password, address, birthday, national_registry, id_role, email_checked, id_checked)
VALUES ('Test', 'User2', 'test@root.com', '$argon2id$v=19$m=19456,t=2,p=1$hTNOkj8jWws8MWdHFj6GoA$s41XpdWq1QVPPKOu9jomE52qexww7mcCjjgKwIKfnAE', 'Test Address', '2000-01-01', '000000-000-03', 1, true, true);

DROP TABLE IF EXISTS type_danger CASCADE;
CREATE TABLE type_danger(
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL,
                            icon varchar(255) NOT NULL,
                            is_used BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO type_danger (name,icon, is_used) VALUES ('Accident','car.side.rear.and.collision.and.car.side.front', true);
INSERT INTO type_danger (name,icon, is_used) VALUES ('Stalker','eye.fill', true);
INSERT INTO type_danger (name,icon, is_used) VALUES ('Fight','figure.boxing', true);
INSERT INTO type_danger (name,icon, is_used) VALUES ('Theft','creditcard.trianglebadge.exclamationmark.fill', true);
INSERT INTO type_danger (name,icon, is_used) VALUES ('Fire','flame.fill', true);
INSERT INTO type_danger (name,icon, is_used) VALUES ('Medical Emergency','cross.fill', true);
INSERT INTO type_danger (name,icon, is_used) VALUES ('Other','questionmark.circle.fill', false);

DROP TABLE IF EXISTS report CASCADE;
CREATE TABLE report(
                       id SERIAL PRIMARY KEY,
                       date TIMESTAMP NOT NULL,
                       lat decimal NOT NULL,
                       lng decimal NOT NULL,
                       street varchar(255) NOT NULL,
                       level INTEGER NOT NULL,
                       is_public BOOLEAN NOT NULL DEFAULT FALSE,
                       for_police BOOLEAN NOT NULL DEFAULT FALSE,
                       photo_path varchar(100),
                       id_member INTEGER NOT NULL REFERENCES member(id),
                       id_type_danger INTEGER NOT NULL REFERENCES type_danger(id)
);

DROP TABLE IF EXISTS team CASCADE;
CREATE TABLE team(
                     id SERIAL PRIMARY KEY,
                     name varchar(50) NOT NULL,
                     id_admin INTEGER NOT NULL REFERENCES member(id),
                     id_report INTEGER REFERENCES report(id),
                     CONSTRAINT fk_team_admin FOREIGN KEY (id_admin) REFERENCES member(id)
);

DROP TABLE IF EXISTS team_member CASCADE;
CREATE TABLE team_member(
                            id SERIAL PRIMARY KEY,
                            accepted BOOLEAN NOT NULL DEFAULT FALSE,
                            id_team INTEGER NOT NULL REFERENCES team(id),
                            id_member INTEGER NOT NULL REFERENCES member(id),
                            CONSTRAINT unique_team_member UNIQUE(id_team, id_member)
);

INSERT INTO team (name, id_admin) VALUES ('Test Team', 1);

INSERT INTO team_member (accepted, id_team, id_member) VALUES
(true, 1, 1),
(true, 1, 2),
(true, 1, 3);

INSERT INTO report (date, lat, lng, street, level, is_public, for_police, photo_path, id_member, id_type_danger) VALUES
('2024-11-15 08:30:00', 50.8505, 4.3488, 'Rue de la Paix 1', 3, true, false, NULL, 1, 1),
('2024-11-14 14:15:00', 50.8515, 4.3500, 'Avenue des Champs 5', 3, true, false, NULL, 1, 2),
('2024-11-13 10:45:00', 50.8525, 4.3510, 'Boulevard Central 12', 2, false, true, NULL, 1, 3),
('2024-11-12 16:20:00', 50.8535, 4.3520, 'Rue du Commerce 8', 3, true, false, NULL, 1, 4),
('2024-11-11 09:00:00', 50.8545, 4.3530, 'Place de la Liberté 15', 1, false, false, NULL, 1, 5),
('2024-11-10 13:30:00', 50.8555, 4.3540, 'Rue de Belgique 22', 3, true, true, NULL, 1, 6),
('2024-11-09 11:15:00', 50.8565, 4.3550, 'Avenue Roi Albert 3', 3, true, false, NULL, 1, 1),
('2024-11-08 15:45:00', 50.8575, 4.3560, 'Rue de l''Espoir 17', 2, false, true, NULL, 1, 2),
('2024-11-07 07:30:00', 50.8585, 4.3570, 'Boulevard de la Paix 9', 1, false, false, NULL, 1, 3),
('2024-11-06 12:00:00', 50.8595, 4.3580, 'Rue de Versailles 25', 3, true, false, NULL, 1, 4),
('2024-11-05 14:20:00', 50.8605, 4.3590, 'Avenue Princesse 11', 3, true, false, NULL, 1, 5),
('2024-11-04 10:30:00', 50.8615, 4.3600, 'Rue des Fleurs 18', 2, false, true, NULL, 1, 6),
('2024-11-03 16:00:00', 50.8625, 4.3610, 'Boulevard Léopold 6', 3, true, false, NULL, 1, 1),
('2024-11-02 08:45:00', 50.8635, 4.3620, 'Rue du Marché 20', 1, false, true, NULL, 1, 2),
('2024-11-01 13:15:00', 50.8645, 4.3630, 'Avenue Lambermont 14', 3, true, false, NULL, 1, 3);


