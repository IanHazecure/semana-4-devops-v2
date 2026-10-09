CREATE DATABASE IF NOT EXISTS my_database;
USE my_database;

CREATE TABLE IF NOT EXISTS personas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(12) NOT NULL UNIQUE,
  fecha_nacimiento DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO personas (nombre, rut, fecha_nacimiento) VALUES
  ('Felipe Ruz', '19961817-2', '1998-12-30'),
  ('Valentina Navarro', '21305556-9', '2003-05-27');