DROP DATABASE IF EXISTS mylibrary;

<<<<<<< HEAD
CREATE DATABASE mylibrary;

USE mylibrary;

CREATE TABLE users (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
auth_id VARCHAR (255) NOT NULL
);

CREATE TABLE books (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
title VARCHAR (255),
author VARCHAR (255),
genre VARCHAR (255),
description VARCHAR (255),
page_count INTEGER,
book_cover VARCHAR (255),
user_added INTEGER,
date_added INTEGER,
FOREIGN KEY (user_added) REFERENCES users(id)
);
=======
CREATE TABLE users(
	id integer auto_increment primary key,
    auth_id varchar (255) not null
    );
    
CREATE TABLE books(
	id integer auto_increment primary key,
    title varchar (255),
    author varchar (255),
    genre varchar (255),
    description varchar (255),
    page_count integer, 
    book_cover varchar(255),
    user_added integer,
    foreign key (user_added) references users(id)
    );
>>>>>>> master
