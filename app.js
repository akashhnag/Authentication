const express=require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const morgan=require('morgan');
const passport=require('passport')
const cors=require('cors');

const config=require('./config/db');


const app=express();
//const jsonParser=bodyParser.json()

require('./config/passport')(passport);
//app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./routes/routes')(app,passport)



app.listen(3000,()=>{
    console.log('Listening to port 3000...');
    
})