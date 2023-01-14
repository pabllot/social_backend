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