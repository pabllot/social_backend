import connect from "../../connect.js";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  const conn = await connect();

  const sql = "SELECT * FROM users";

  conn.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getUser = async (req, res) => {
  const conn = await connect();

  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE id = ?";

  conn.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};
export const updateUser = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    conn.query(
      sql,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!s");
      }
    );
  });
};

export const deleteUser = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    if (userInfo.id !== 2)
      return res.status(403).json("You don't have access to do it!!!");

    const sql = "DELETE FROM users WHERE `id`=?";

    conn.query(sql, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("User has been deleted.");
      return res.status(403).json("Did not work");
    });
  });
};