import mysql from 'mysql'
import * as dotenv from 'dotenv'
dotenv.config()

export const db = mysql.createPool({
  connectionLimit : 10,
  host: "127.0.0.1",
  user: "root",
  password:  process.env.PASSWORD_MYSQL,
  database: "social",

})
