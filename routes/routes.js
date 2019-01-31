//const passport=require('passport');
const jwt=require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const bcrypt=require('bcrypt');

const config=require('../config/db');
module.exports=(app,passport)=>{
    app.get('/',(req,res)=>{
        res.send('Receiving request..')
    })

    //register
    app.post('/register',(req,res)=>{  
        MongoClient.connect('mongodb://127.0.0.1:27017',(err,db)=>{
            if(err){
                console.log(err);                
            }
            else{
                let dbo=db.db('auth')            
                bcrypt.hash(req.body.pass, 10, function(err, hash) {
                    // Store hash in your password DB.
                    if(err){
                        console.log('Problem registering user');                
                    }
                    else{
                        let obj={user:req.body.user,pass:hash}
                        dbo.collection('users').insertOne(obj,(err,data)=>{
                            if(err){
                                console.log(err);                
                            }
                            else{
                                console.log('data',data.ops);
                                res.send('User registered..')                
                            }
                        })
                    }        
                });   
            }
        })  
    })

    //login
    app.post('/login',(req,res)=>{
        MongoClient.connect('mongodb://127.0.0.1:27017',(err,db)=>{
            if(err){
                console.log(err);            
            }
            else{
                let dbo=db.db('auth');
                dbo.collection('users').findOne({user:req.body.user},(err,data)=>{
                    if(err){
                        console.log(err);
                        
                    }
                    else{
                        if(data===null){
                            res.send('Wrong username or password');  
                        }
                        else{
                           
                        if(bcrypt.compareSync(req.body.pass, data.pass)==true)
                        {
                            let token=jwt.sign(data,config.secret,{expiresIn:'30m'})                            
                            res.json({success:true,token:token,message:'Login Successful'})
                        }
                        else{
                            res.send('Wrong username or password');                        
                        }
                        }         
                        console.log(data);                    
                    }               
                })        
            }
        })    
    })

    //reset password
    app.post('/reset',(req,res)=>{
        MongoClient.connect('mongodb://127.0.0.1:27017',(err,db)=>{
            if(err){
                console.log(err);            
            }
            else{
                let dbo=db.db('auth');
                dbo.collection('users').findOne({user:req.body.user},(err,data)=>{
                    if(err){
                        console.log(err);
                        
                    }
                    else{
                        if(data===null){
                            res.send('Wrong username or password');  
                        }
                        else{
                           
                        if(bcrypt.compareSync(req.body.oldpass, data.pass)==true)
                        {
                                                 
                            bcrypt.hash(req.body.newpass, 10, function(err, hash) {
                                // Store hash in your password DB.
                                if(err){
                                    console.log('Problem occured. Please try again');                
                                }
                                else{  
                                    try{
                                        dbo.collection('users').replaceOne({user:req.body.user},{user:req.body.user,pass:hash});
                                        res.json({success:true,message:'Password changed'}) 
                                    }
                                    catch(e){
                                        console.log(e);
                                        
                                    }                                      
                                    
                                }        
                            });                       
                        }
                        else{
                            res.send('Wrong username or password');                        
                        }
                        }         
                        //console.log('new password',data.pass);                    
                    }               
                })        
            }
        })    
    })

    //dashboard
    app.get('/dashboard', passport.authenticate('jwt',{session:false}),(req,res)=>{
        res.send('Logged in user..')
    })

    //logout
    app.get('/logout', (req,res)=>{
        
        res.redirect('/')
    })
    
}