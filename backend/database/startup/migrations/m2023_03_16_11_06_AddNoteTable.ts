export default {
  name: "m2023_03_16_11_06_AddNoteTable",
  query: `
        CREATE TABLE Notes (
            id CHAR(36) NOT NULL,
            name varchar(255) NOT NULL,
            text TEXT NULL,
            userId CHAR(36) NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT FK_UserNote FOREIGN KEY (userId) REFERENCES Users(id)
        );  
    `,
};
