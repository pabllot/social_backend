import connect from "../config/connect.js";
import moment from "moment";

export const getComments_sql = async (postId) => {
  const conn = await connect();

  const sql = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) 
        WHERE c.postId = ? ORDER BY c.createdAt DESC `;
  const [result] = await conn.query(sql, [postId]);
  return result;
};

export const newComment_sql = async (desc, id, postId) => {
  const conn = await connect();

  const sql =
    "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
  const values = [
    desc,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    id,
    postId,
  ];
  const [result] = await conn.query(sql, [values]);
  return result;
};

export const deleteComment_sql = async (userId, postId) => {
  const conn = await connect();

  const sql = "DELETE FROM comments WHERE `userId` = ? AND `id` = ?";
  const values = [userId, postId];
  const [result] = await conn.query(sql, values);
  return result;
};
