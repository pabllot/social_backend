import connect from "../db/config/connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = async (req, res) => {
  const conn = await connect();

  const sql = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  try {
    const [result] = await conn.query(sql, [req.query.followedUserId]);
    res.send(result.map((relationship) => relationship.followerUserId));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const addRelationship = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES  (?)";

    const values = [userInfo.id, req.body.userId];

    try {
      await conn.query(sql, [values]);
      res.send("Following");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteRelationship = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    try {
      await conn.query(sql, [userInfo.id, req.query.userId]);
      res.send("unfollowed!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
