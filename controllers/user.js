import {db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const getUsers = (req, res) => {
    const q = "SELECT * FROM users" 
    
    db.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        
        connection.query(q, (err, data) => {
            connection.release()
            if(err) return res.status(500).json(err)
            return res.status(200).json(data);
        })
    })
    }


export const getUser = (req, res)=>{
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?"

    db.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(q, [userId], (err, data)=> {
            connection.release()
        if(err) return res.status(500).json(err)
        const { password, ...info} = data[0];
        return res.json(info);
    } )
    })
}

export const updateUser = (req, res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo)=>{
    if(err) return res.status(403).json("Token is not valid!")

    const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    db.query(q, [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id
    ], (err, data)=>{
        if(err) res.status(500).json(err)
        if(data.affectedRows > 0) return res.json("Updated!")
        return res.status(403).json("You can update only your post!s")
    })
})
};

export const deleteUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      if(userInfo.id !== 2) return res.status(403).json("You don't have access to do it!!!");
  
      const q =
        "DELETE FROM users WHERE `id`=?";
  
      db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("User has been deleted.");
        return res.status(403).json("Did not work")
      });
    });
  };