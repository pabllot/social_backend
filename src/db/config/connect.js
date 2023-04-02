import mysql from "mysql2";

const database = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "social",
};

const connect = async () => {
  if (global.connection && global.connection.state !== "disconnected") return global.connection;

  const connection = mysql.createPool(database);

  console.log(`Connection sucessfully on DB ${database.database}`);
  global.connection = connection.promise();
  return connection;
};

connect();

export default connect;
