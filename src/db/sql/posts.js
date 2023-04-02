import moment from "moment";
import connect from "../config/connect.js";

export const getPosts_sql = async (userId, id) => {
  const conn = await connect();
  const sql =
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? 
      ORDER BY p.createdAt DESC`;

  const values = userId !== "undefined" ? [userId] : [id, id];
  const [result] = await conn.query(sql, values);
  return result;
};

export const newPost_sql = async (desc, img, id) => {
  const conn = await connect();
  const sql = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
  const values = [desc, img, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), id];
  const [result] = await conn.query(sql, [values]);
  return result;
};

export const deletePost_sql = async (postId, userId) => {
  const conn = await connect();
  const sql = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
  const values = [postId, userId];
  const [result] = await conn.query(sql, values);
  return result;
};
