DROP DATABASE IF exists mylibrary;
CREATE DATABASE mylibrary;
USE mylibrary;

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