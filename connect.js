import mysql from 'mysql'
import * as dotenv from 'dotenv'
dotenv.config()

export const db  = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'root',
    password        : process.env.PASSWORD_MYSQL,
    database        : 'social'
  });