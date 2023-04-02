import connect from "../config/connect.js";

export const getLikes_sql = async (id) => {
  const conn = await connect();

  const sql = "SELECT userId FROM likes WHERE postId = ?";
  const [result] = await conn.query(sql, [id]);
  return result;
};

export const newLike_sql = async (userId, postId) => {
  const conn = await connect();

  const sql = "INSERT INTO likes (`userId`, `postId`) VALUES  (?)";
  const values = [userId, postId];
  const [result] = await conn.query(sql, [values]);
  return result;
};

export const deleteLike_sql = async (userId, postId) => {
  const conn = await connect();

  const sql = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
  const values = [userId, postId];
  const [result] = await conn.query(sql, values);
  return result;
};
