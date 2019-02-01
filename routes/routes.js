//const passport=require('passport');
const jwt=require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const bcrypt=require('bcrypt');

const dbDetails=require('../config/db');

module.exports=(app,passport)=>{
    app.get('/',(req,res)=>{
        res.send('Receiving request..')
    })

    //register
    app.post('/register',(req,res)=>{  
        MongoClient.connect(dbDetails.url,(err,db)=>{
            if(err){
                console.log(err);                
            }
            else{
                let dbo=db.db(dbDetails.name) 
                console.log(req.body.user);
                
                dbo.collection(dbDetails.collection).findOne({user:req.body.user},(err,data)=>{
                    if(err){
                        console.log(err);
                        
                    }
                    else{                                         
                        if(data===null){                     
                            bcrypt.hash(req.body.pass, 10, function(err, hash) {
                                // Store hash in your password DB.
                                if(err){
                                    console.log('Problem registering user');                
                                }
                                else{
                                    let obj={user:req.body.user,pass:hash}
                                    dbo.collection(dbDetails.collection).insertOne(obj,(err,data)=>{
                                        if(err){
                                            console.log(err);                
                                        }
                                        else{
                                            
                                            res.send('User registered..')                
                                        }
                                    })
                                }        
                            });  
                        }
                        else{
                            console.log('name already present');
                            console.log('lets see data',data.user);
                            
                            res.send('Username already present. please choose different one')
                        }
                    }
                })           
                
            }
        })  
    })

    //login
    app.post('/login',(req,res)=>{
        MongoClient.connect(dbDetails.url,(err,db)=>{
            if(err){
                console.log(err);            
            }
            else{
                let dbo=db.db(dbDetails.name);
                dbo.collection(dbDetails.collection).findOne({user:req.body.user},(err,data)=>{
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
        MongoClient.connect(dbDetails.url,(err,db)=>{
            if(err){
                console.log(err);            
            }
            else{
                let dbo=db.db(dbDetails.name);
                dbo.collection(dbDetails.collection).findOne({user:req.body.user},(err,data)=>{
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
                                        dbo.collection(dbDetails.collection).replaceOne({user:req.body.user},{user:req.body.user,pass:hash});
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