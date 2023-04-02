import connect from "../db/config/connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
  const conn = await connect();

  const sql = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) 
        WHERE c.postId = ? ORDER BY c.createdAt DESC `;

  try {
    const [result] = await conn.query(sql, [req.query.postId]);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const addComment = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql =
      "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    try {
      await conn.query(sql, [values]);
      res.send("comment has been created!!!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteComment = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql = "DELETE FROM comments WHERE `userId` = ? AND `id` = ?";

    try {
      await conn.query(sql, [userInfo.id, req.params.id]);
      res.send("comment has been deleted!!!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
