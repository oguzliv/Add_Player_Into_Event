require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser'); 

const routes = require("./routes/routes");
const {auth,tokenAuth} = require("./routes/auth");

const db_string = process.env.DB_URL;
const PORT = 8000;

mongoose.connect(db_string);
const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
});

db.once('connected', () => {
    console.log('db is connected' )
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api',tokenAuth,routes);
app.use('/auth', auth);


app.listen(PORT, () =>{
    console.log(`server up on port ${PORT}`);
});
