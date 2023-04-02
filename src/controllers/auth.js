import connect from "../db/config/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const conn = await connect();

  // CHECK IF USER EXISTS
  const sql = "SELECT * FROM users WHERE username = ?";

  const [result] = await conn.query(sql, [req.body.username]);
  if (result.length) return res.status(409).json("User already exists!");

  //CREATE NEW USER

  //HASH THE PASSWORD
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const q =
    "INSERT INTO users (`username`, `password`, `name`, `profilePic`, `coverPic`) VALUE (?)";

  const values = [
    req.body.username,
    hashedPassword,
    req.body.name,
    req.body.profilePic,
    req.body.coverPic,
  ];

  try {
    await conn.query(q, [values]);
    res.send("user has been created");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const login = async (req, res) => {
  const conn = await connect();

  const sql = "SELECT * FROM users WHERE username = ?";

  const [result] = await conn.query(sql, [req.body.username]);
  if (result.length === 0) return res.status(404).json("User not found.");

  const checkPassword = bcrypt.compareSync(
    req.body.password,
    result[0]?.password
  );

  if (!checkPassword) return res.status(400).json("Wrong password or username");

  const token = jwt.sign({ id: result[0].id }, "secretkey");

  const { password, ...others } = result[0];

  res
    .cookie("accessToken", token, {
      httpOnly: true,
    })
    .status(200)
    .json(others);
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("user has been logged out.");
};
