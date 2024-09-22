declare namespace NodeJS {
  export interface ProcessEnv {
    DB_HOST?: string;
    DB_PORT?: string;
    MYSQL_USER?: string;
    MYSQL_PASSWORD?: string;
    MYSQL_DB_NAME?: string;
    JWT_SECRET?: string;
    JWT_EXPIRATION_TIME?: string;
    PORT?: string;
  }
}
