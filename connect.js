import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const MYSQLUSER = process.env.MYSQLUSER || 'root'
const MYSQLPASSWORD = process.env.MYSQLPASSWORD || 'password'
const MYSQLDATABASE = process.env.MYSQLDATABASE || 'social'
const MSQLHOST = process.env.MSQLHOST || 'localhost'
const MYSQLPORT = process.env.MYSQLPORT || 3306

export const db = mysql.createConnection({
  host: MSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE,
  port: MYSQLPORT 
})
