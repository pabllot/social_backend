import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AccessControlAllowCredentials } from "./src/middlewares/Access-Control-Allow-Credentials.js";
import { corsOptions } from "./src/middlewares/cors.js";
import { upload } from "./src/middlewares/multer.js";
import userRoutes from "./src/routes/user.js";
import authRoutes from "./src/routes/auth.js";
import likesRoutes from "./src/routes/likes.js";
import commentsRoutes from "./src/routes/comments.js";
import postsRoutes from "./src/routes/posts.js";
import relationshipRoutes from "./src/routes/relationships.js";

dotenv.config();

const app = express();

app.use(AccessControlAllowCredentials);
app.use(express.json());
app.use(cors({ origin: corsOptions }));
app.use(cookieParser());

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/relationships", relationshipRoutes);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("backend working on port" + PORT);
});
