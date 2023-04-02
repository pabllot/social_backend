import jwt from "jsonwebtoken";
import { deletePost_sql, getPosts_sql, newPost_sql } from "../db/sql/posts.js";

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const result = await getPosts_sql(userId, userInfo.id);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await newPost_sql(req.body.desc, req.body.img, userInfo.id);
      res.send("user has been created");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const result = await deletePost_sql(req.params.id, userInfo.id);
      if (result.affectedRows > 0) return res.send("post has been deleted!");
      return res.status(403).json("You can delete only your post");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
