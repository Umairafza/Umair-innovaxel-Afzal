CREATE DATABASE url_shortener;

USE url_shortener;

CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url VARCHAR(255) NOT NULL,
  short_code VARCHAR(50) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  access_count INT DEFAULT 0
);