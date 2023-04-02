import connect from "../db/config/connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = async (req, res) => {
  const conn = await connect();

  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? 
      ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    try {
      const [result] = await conn.query(q, values);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const addPost = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    try {
      await conn.query(q, [values]);
      res.send("user has been created");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deletePost = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    try {
      const [result] = await conn.query(q, [req.params.id, userInfo.id]);
      if (result.affectedRows > 0) return res.send("post has been deleted!");
      return res.status(403).json("You can delete only your post");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
