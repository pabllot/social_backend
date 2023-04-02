import connect from "../config/connect.js";

export const userExists_sql = async (username) => {
  const conn = await connect();

  // CHECK IF USER EXISTS
  const sql = "SELECT * FROM users WHERE username = ?";

  const [result] = await conn.query(sql, username);
  return result;
};

export const createNewUser_sql = async (
  username,
  hashedPassword,
  name,
  profilePic,
  coverPic
) => {
  const conn = await connect();

  // CHECK IF USER EXISTS
  const sql =
    "INSERT INTO users (`username`, `password`, `name`, `profilePic`, `coverPic`) VALUES (?, ?, ?, ?, ?)";

  const values = [username, hashedPassword, name, profilePic, coverPic];

  const [result] = await conn.query(sql, values);
  return result;
};

export const login_sql = async (username) => {
  const conn = await connect();

  const sql = "SELECT * FROM users WHERE username = ?";

  const [result] = await conn.query(sql, username);
  return result;
};
