import connect from "../config/connect.js";

export const getUsers_sql = async () => {
  const conn = await connect();
  const sql = "SELECT * FROM users";
  const [result] = await conn.query(sql);
  return result;
};

export const getUser_sql = async (userId) => {
  const conn = await connect();
  const sql = "SELECT * FROM users WHERE id = ?";
  const [result] = await conn.query(sql, [userId]);
  return result;
};

export const updateUser_sql = async (name, city, website, profilePic, coverPic, userInfoId) => {
  const conn = await connect();
  const sql = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";
  const [result] = await conn.query(sql, [name, city, website, profilePic, coverPic, userInfoId]);
  return result;
};

export const deleteUser_sql = async (id) => {
  const conn = await connect();
  const sql = "DELETE FROM users WHERE `id`=?";
  const [result] = await conn.query(sql, id);
  return result;
};
