export default {
  name: "m2023_03_04_00_00_AddUsersTable",
  query: `
        CREATE TABLE Users (
            id CHAR(36) NOT NULL,
            email varchar(255) NOT NULL,
            passwordHash varchar(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE (email)
        );  
    `,
};
