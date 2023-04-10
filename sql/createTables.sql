CREATE TABLE IF NOT EXISTS developers (
     id        INTEGER PRIMARY KEY SERIAL,
     name      VARCHAR(50) NOT NULL,
     email     VARCHAR(50) NOT NULL,
);

CREATE TABLE IF NOT EXISTS developer_info (
     id             INTEGER PRIMARY KEY SERIAL,
     "preferredOS"  OS NOT NULL,
     "developerId"  INTEGER UNIQUE NOT NULL,
     FOREIGN KEY (developerId) REFERENCES developers(id)
);

CREATE TABLE IF NOT EXISTS projects (
     id             INTEGER PRIMARY KEY SERIAL,
     name           VARCHAR(50) NOT NULL,
     description    TEXT,
     estimatedTime  VARCHAR(20) NOT NULL,
     repository     VARCHAR(50) NOT NULL,
     startDate      DATE NOT NULL,
     end            DATE,
     developerId    INTEGER,
     FOREIGN KEY (developerId) REFERENCES developers(id)
);

CREATE TABLE IF NOT EXISTS technologies (
     id   INTEGER PRIMARY KEY SERIAL,
     name VARCHAR(50) NOT NULL,
);

CREATE TABLE IF NOT EXISTS projects_technologies (
     id             INTEGER PRIMARY KEY SERIAL,
     addedin        DATE NOT NULL,
     "technologId"  INTEGER NOT NULL,
     FOREIGN KEY (technologId) REFERENCES technologies(id)
     "projectId"    INTEGER NOT NULL,
     FOREIGN KEY (projectId) REFERENCES projects(id)
);