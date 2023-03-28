export default {
    name: 'm2023_03_16_11_06_AddNoteTable',
    query: `
        CREATE TABLE Notes (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            text TEXT NULL,
            userId int NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT FK_UserNote FOREIGN KEY (userId) REFERENCES Users(id)
        );  
    `
};