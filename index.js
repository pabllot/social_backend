import express from "express";
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import likesRoutes from './routes/likes.js'
import commentsRoutes from './routes/comments.js'
import postsRoutes from './routes/posts.js'
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

// MIDDLEWARES
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/likes", likesRoutes)

app.listen(8800, ()=>{
    console.log("backend working")
})