import jwt from "jsonwebtoken";
import { deleteUser_sql, getUser_sql, getUsers_sql, updateUser_sql } from "../db/sql/user.js";

export const getUsers = async (req, res) => {
  try {
    const result = await getUsers_sql();
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const result = await getUser_sql(req.params.userId);
    const { password, ...info } = result[0];
    return res.send(info);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const updateUser = async (req, res) => {
  const { name, city, website, profilePic, coverPic } = req.body;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const result = await updateUser_sql(name, city, website, profilePic, coverPic, userInfo.id);
      if (result.affectedRows > 0) return res.send("User has been updated!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    if (userInfo.id !== 2) return res.status(403).json("You don't have access to do it!!!");

    try {
      const result = await deleteUser_sql(req.params.id);
      if (result.affectedRows > 0) return res.send("User has been deleted!");
      return res.status(403).json("You can update only your user");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
