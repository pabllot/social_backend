import connect from "../db/config/connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  const conn = await connect();

  const q = "SELECT userId FROM likes WHERE postId = ?";

  try {
    const [result] = await conn.query(q, [req.query.postId]);
    return res.send(result.map((like) => like.userId));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const addLike = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (`userId`, `postId`) VALUES  (?)";

    const values = [userInfo.id, req.body.postId];

    try {
      await conn.query(q, [values]);
      res.send("post has been liked!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteLike = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    try {
      await conn.query(q, [userInfo.id, req.query.postId]);
      res.send("post has been unliked!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
