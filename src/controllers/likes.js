import jwt from "jsonwebtoken";
import { deleteLike_sql, getLikes_sql, newLike_sql } from "../db/sql/likes.js";

export const getLikes = async (req, res) => {
  try {
    const result = await getLikes_sql(req.query.postId);
    return res.send(result.map((like) => like.userId));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await newLike_sql(userInfo.id, req.body.postId);
      res.send("post has been liked!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await deleteLike_sql(userInfo.id, req.query.postId);
      res.send("post has been unliked!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
