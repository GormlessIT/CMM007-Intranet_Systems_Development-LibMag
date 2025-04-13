CREATE DATABASE LibMag;
USE LibMag;

CREATE TABLE users
(
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE books
(
    bookID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn CHAR(13) UNIQUE NOT NULL,
    genre ENUM('Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller') NOT NULL,
    quantity INT NOT NULL
);

CREATE TABLE loans
(
    loanID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    bookID INT,
    loanDate DATETIME,
    returnDate DATETIME,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (bookId) REFERENCES books(bookId)
);