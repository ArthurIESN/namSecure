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
    reject_reason VARCHAR(200), 
)

DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member (
    id SERIAL PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    email_checked BOOLEAN DEFAULT FALSE,
    id_checked BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL,
    password_last_update TIMESTAMP,
    address varchar(100) NOT NULL,
    birthday DATE NOT NULL,
    national_registry VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_role INTEGER NOT NULL REFERENCES member_role(id),
    id_member_2fa INTEGER NOT NULL REFERENCES member_2fa(id)
);

DROP TABLE IF EXISTS member_group CASCADE;
CREATE TABLE member_group(
    id SERIAL PRIMARY KEY,
    id_admin INTEGER NOT NULL REFERENCES member(id),
    name varchar(50) NOT NULL
);

DROP TABLE IF EXISTS member_group CASCADE;
CREATE TABLE member_group(
    id SERIAL PRIMARY KEY,
    id_group INTEGER NOT NULL REFERENCES member_group(id),
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
    attempts INTEGER NOT NULL,
    id_member INTEGER NOT NULL REFERENCES member(id)
);

