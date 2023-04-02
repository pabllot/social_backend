import connect from "../db/config/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createNewUser_sql,
  login_sql,
  userExists_sql,
} from "../db/sql/auth.js";

export const register = async (req, res) => {
  const { username } = req.body;

  // CHECK IF USER EXISTS
  const result = await userExists_sql(username);
  if (result.length) return res.status(409).json("User already exists!");

  //CREATE NEW USER
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  const { name, profilePic, coverPic } = req.body;

  try {
    await createNewUser_sql(
      username,
      hashedPassword,
      name,
      profilePic,
      coverPic
    );
    res.send("user has been created!!!");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const login = async (req, res) => {
  const result = await login_sql(req.body.username);
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
