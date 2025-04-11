CREATE DATABASE LibMag;
USE LibMag;

CREATE TABLE users
(
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE books
(
    bookId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn CHAR(13) UNIQUE NOT NULL,
    genre ENUM('Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller') NOT NULL,
    quantity INT NOT NULL
);

CREATE TABLE loans
(
    loanId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    bookId INT NOT NULL,
    loanDate DATETIME NOT NULL,
    returnDate DATETIME NOT NULL,
    status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
    returnedOn DATETIME,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (bookId) REFERENCES books(bookId)
);