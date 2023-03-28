import databaseContext from "./startup/databaseContext";
export function getConnection() {
    return databaseContext.getDatabaseConnection();
}
