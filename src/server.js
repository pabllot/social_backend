import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRoutes, authRoutes, likesRoutes, commentsRoutes, postsRoutes, relationshipRoutes } from "./routes/exports.js";
import { AccessControlAllowCredentials } from "./middlewares/Access-Control-Allow-Credentials.js";
import { corsOptions } from "./middlewares/cors.js";
import { upload } from "./middlewares/multer.js";

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

const PORT = 8800;

app.listen(PORT, () => {
  console.log("backend working on port" + PORT);
});
