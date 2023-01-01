const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = express.Router();

const {User} = require('../models/model');

auth.post('/signin', async(req , res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        level: req.body.level
    })

    try{
        const dataToSave = await user.save();
        res.status(200).json(dataToSave);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
});

auth.post('/login', async(req, res) => {
    try{
        const user = await User.find({username : req.body.username});
        const data = {
            id: user[0]._id,
            username: user[0].username
        }
        const token = genereateToken(data);
        console.log(token);

        res.cookie('access_token',token, {
            httpOnly: true,
            expiresIn: '10d',
            overwrite: true
        });
        res.json(token);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});


const genereateToken = (data) => {
    return jwt.sign(data, process.env.SECRET, {expiresIn : '10d'});
}

const authenticateToken = (req, res, next) => {
  
    if (req.cookies.access_token == null) return res.sendStatus(401)
  
    jwt.verify(req.cookies.access_token, process.env.SECRET , (err, user) => {
  
      if (err) return res.sendStatus(403)
      req.user = user
  
      next()
    })
  }

module.exports = {
    auth: auth,
    tokenAuth: authenticateToken
}