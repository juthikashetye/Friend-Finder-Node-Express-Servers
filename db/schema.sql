DROP DATABASE IF EXISTS friend_finder_db;

CREATE DATABASE friend_finder_db;

USE friend_finder_db;

CREATE TABLE questions (
    id INT NOT NULL AUTO_INCREMENT, 
    question VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE friends (
    id INT NOT NULL AUTO_INCREMENT, 
    name VARCHAR(255) NOT NULL,
    picture_link TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE scores (
    id INT NOT NULL AUTO_INCREMENT,
    question_id INT NOT NULL,
    friend_id INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (friend_id) REFERENCES friends(id),
    PRIMARY KEY(id)
);