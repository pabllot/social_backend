import express from "express";
import * as dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import likesRoutes from './routes/likes.js'
import commentsRoutes from './routes/comments.js'
import postsRoutes from './routes/posts.js'
import relationshipRoutes from './routes/relationships.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import multer from 'multer'

dotenv.config()

const app = express();


// MIDDLEWARES
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json())
const whitelist = ['http:/localhost3000', 'https://socialmediapablot.vercel.app/']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  }
}
app.use(cors({
  origin: corsOptions
}))
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
  });

  app.use("/api/auth", authRoutes)
  app.use("/api/users", userRoutes)
  app.use("/api/posts", postsRoutes)
  app.use("/api/comments", commentsRoutes)
  app.use("/api/likes", likesRoutes)
  app.use("/api/relationships", relationshipRoutes)
  
  const PORT = process.env.PORT || 8800

  app.listen(PORT, ()=>{
    console.log("backend working on port" + PORT)
  })