import {db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const getUsers = (req, res) => {
    const q = "SELECT * FROM users" 
    
    db.getConnection((err, connection) => {
        if(err) console.log(err.message)
        
        connection.query(q, (err, data) => {
            connection.release()
            if(err) return res.status(500).json(err)
            return res.status(200).json(data);
        })
    })
    }


