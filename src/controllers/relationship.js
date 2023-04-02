import jwt from "jsonwebtoken";
import { deleteRelationship_sql, getRelationships_sql, newRelationship_sql } from "../db/sql/relationship.js";

export const getRelationships = async (req, res) => {
  try {
    const result = await getRelationships_sql(req.query.followedUserId);
    res.send(result.map((relationship) => relationship.followerUserId));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await newRelationship_sql(userInfo.id, req.body.userId);
      res.send("Following");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      await deleteRelationship_sql(userInfo.id, req.query.userId);
      res.send("unfollowed!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
