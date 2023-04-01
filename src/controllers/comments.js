import connect from "../../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
  const conn = await connect();

  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) 
        WHERE c.postId = ? ORDER BY c.createdAt DESC `;

  conn.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];
    conn.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created!");
    });
  });
};

export const deleteComment = async (req, res) => {
  const conn = await connect();

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM comments WHERE `userId` = ? AND `id` = ?";

    conn.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Commet has been deleted!");
    });
  });
};
