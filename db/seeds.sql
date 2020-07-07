use mylibrary;

INSERT INTO users (auth_id, location, credits) 
VALUES ('auth0|5efe8a69a15b7b001361ce52', 'St. Clair and Yonge, Toronto', 2),
    ('google-oauth2|107478579241719314235', 'St. Clair and Yonge, Toronto', 4),
    ('google-oauth2|113832903861403532486', 'St. Clair and Yonge, Toronto', 2),
    ('google.oauth2|117292005270119800251', 'St. Clair and Yonge, Toronto', 4);


INSERT INTO books (title, author, genre, description, page_count, book_cover, possession_id, date_added)
VALUES ('The Last Theorem', 'Arthur C. Clarke, Frederik Pohl', 'Fiction, Science Fiction, Alien Contact', 'Two of science 
fiction’s most renowned writers join forces for a storytelling sensation. The historic collaboration 
between Frederik Pohl and his fellow founding father of the genre, Arthur C. Clarke, is both a momentous 
literary event and a fittingly grand farewell from the late, great visionary author of 2001: A Space 
Odyssey.', '320', 'https://books.google.ca/books/content?id=cNaOyJ5dtywC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72Dm9u8_M5gyF-8sogU0te9D9BuEiHTiCW3aMCwE88RGwuS5JUxrco-5UITbf10xcDOx6styFMvOW7DVaILlR1T_rVrHHnmM9G8-6iPi8HVlz7o3pv9OZ9ijkKGrNi6YlNQ5P5I', '1', CURDATE() );
INSERT INTO books (title, author, genre, description, page_count, book_cover, possession_id, date_added)
VALUES ('A Tale for the Time Being', 'Ruth Ozeki', 'Fiction', '“A time being is someone who lives in 
time, and that means you, and me, and every one of us who is, or was, or ever will be.”', '398', 'https://books.google.ca/books/content?id=AkczPdrwq80C&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71PJC0Jtk4zkEX7VeDw9Dn5b0l56cPriJkzQV6xofBpasIUQ4CpOhEbH7dzsC9a0Ua95fy7Iw3zdf_G0nzqmBNKnmPD9Ssv_SpVpVTPzuGnXy3fypxVpwvmMU4yDtHiC36x0QMU', '2', CURDATE() );
INSERT INTO books (title, author, genre, description, page_count, book_cover, possession_id, date_added)
VALUES ('The Old Man and the Sea', 'Earnest Miller Hemingway', 'Fiction', 'This is an Egyptian edition of one 
of the most internationally celebrated works of fiction, Hemingway’s The old Man and the Sea. 
A Pulitzer-award and - Noble-prize winner, this work has cer- tainly become so extensively known all 
over the world, receiving a myriad of critical studies and translations. Hemingway himself could have 
never imagined such a sweeping success for his novel- la, devised while temporarily staying (for a few
 weeks) at a fishing village in Cuba. It is not simply the story of a big fish catch, but it is the 
 story of a touching human relationship between old age and younghood, not to mention its highly 
 philosophical message that it carries. All this, apart from other equally significant factors, makes 
 Hemingway’s work worth reading and contemplating.', '84', 'https://books.google.ca/books/content?id=rl9kCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71nstrPt9UYrsiYblsXBstNzswfOsxOBexTXxFb17OyzUs9GRfU5atDg3p5lBi0aoJfZuWc2kfLbNP0hgOk3hVEGW2GqWWyM_icGVoXAEGLWpyEDP5E6Xd-s3nWitOwggLB3eYO', '3', CURDATE() );
INSERT INTO books (title, author, genre, description, page_count, book_cover, possession_id, date_added)
VALUES ('Game of Thrones: A Song of Ice and Fire: Book One', 'George R. R. Martin', 'Fiction, Fantasty, 
Epic', 'Winter is coming. Such is the stern motto of House Stark, the northernmost of the fiefdoms that owe 
allegiance to King Robert Baratheon in far-off King’s Landing. There Eddard Stark of Winterfell rules in 
Robert’s name. There his family dwells in peace and comfort: his proud wife, Catelyn; his sons Robb, 
Brandon, and Rickon; his daughters Sansa and Arya; and his bastard son, Jon Snow. Far to the north, behind 
the towering Wall, lie savage Wildings and worse—unnatural things relegated to myth during the centuries-long 
summer, but proving all too real and all too deadly in the turning of the season. Yet a more immediate 
threat lurks to the south, where Jon Arryn, the Hand of the King, has died under mysterious circumstances. 
Now Robert is riding north to Winterfell, bringing his queen, the lovely but cold Cersei, his son, the cruel, 
vainglorious Prince Joffrey, and the queen’s brothers Jaime and Tyrion of the powerful and wealthy House 
Lannister—the first a swordsman without equal, the second a dwarf whose stunted stature belies a brilliant 
mind. All are heading for Winterfell and a fateful encounter that will change the course of kingdoms. 
Meanwhile, across the Narrow Sea, Prince Viserys, heir of the fallen House Targaryen, which once ruled all 
of Westeros, schemes to reclaim the throne with an army of barbarian Dothraki—whose loyalty he will purchase 
in the only coin left to him: his beautiful yet innocent sister, Daenerys.', '720', 'https://books.google.ca/books/content?id=5NomkK4EV68C&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70qQ61-n8AH6P8WzSFH3S1mM6_lYJl8cnmuB_UGZStXyIYtZpKjyAXNL-e6g29SaQUzNjKyltIIPYZzfXo4MGeMI0-SLa1o42j3NfMSIF15WQ9V9xhkJSS7pT-_59T0QmZGlrRj', '4', CURDATE() );

INSERT INTO messages (sender_id, recipient_id, message_text, book_requested_id) VALUES
	(2, 1, 'I would like to meetup tuesday at 7 to exchange', 1),
    (1, 2, 'I would like to meet up wednesday', 2);