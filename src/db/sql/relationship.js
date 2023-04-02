import connect from "../config/connect.js";

export const getRelationships_sql = async (id) => {
  const conn = await connect();
  const sql = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  const [result] = await conn.query(sql, [id]);
  return result;
};

export const newRelationship_sql = async (followerId, followedId) => {
  const conn = await connect();
  const sql = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
  const values = [followerId, followedId];
  const [result] = await conn.query(sql, [values]);
  return result;
};

export const deleteRelationship_sql = async (followerId, followedId) => {
  const conn = await connect();
  const sql = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
  const values = [followerId, followedId];
  const [result] = await conn.query(sql, values);
  return result;
};
