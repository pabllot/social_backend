import connect from "../db/config/connect.js";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  const conn = await connect();

  const sql = "SELECT * FROM users";
  let [result] = await conn.query(sql);
  return res.send(result);
};

export const getUser = async (req, res) => {
  const conn = await connect();

  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE id = ?";

  try {
    const [result] = await conn.query(sql, [userId]);
    const { password, ...info } = result[0];
    return res.send(info);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const updateUser = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      userInfo.id,
    ];

    try {
      const [result] = await conn.query(sql, values);
      if (result.affectedRows > 0) return res.send("User has been updated!");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};

export const deleteUser = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    if (userInfo.id !== 2)
      return res.status(403).json("You don't have access to do it!!!");

    const sql = "DELETE FROM users WHERE `id`=?";

    try {
      const [result] = await conn.query(sql, [req.params.id]);
      if (result.affectedRows > 0) return res.send("User has been deleted!");
      return res.status(403).json("You can update only your user");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
};
