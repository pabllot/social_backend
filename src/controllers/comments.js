import jwt from "jsonwebtoken";
import { deleteComment_sql, getComments_sql, newComment_sql } from "../db/sql/comments.js";

export const getComments = async (req, res) => {
  try {
    const result = await getComments_sql(req.query.postId);
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const addComment = async (req, res) => {
  const { desc, postId } = req.body;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await newComment_sql(desc, userInfo.id, postId);
      res.send("comment has been created!!!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await deleteComment_sql(userInfo.id, req.params.id);
      res.send("comment has been deleted!!!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
