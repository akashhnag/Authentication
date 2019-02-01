var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const MongoClient = require('mongodb').MongoClient;
const db = require('./db');
console.log(db);

module.exports=(passport)=>{
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'akash';
    // opts.issuer = 'accounts.examplesoft.com';
    // opts.audience = 'yoursite.net';

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        
        
        MongoClient.connect('mongodb://127.0.0.1:27017',(err,db)=>{
            if(err){
                console.log(err);
                
            }
            else{
                let dbo=db.db('auth')
                dbo.collection('users').findOne({id: jwt_payload.sub}, function(err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        console.log('user is present');
                        console.log('jwt_payload',jwt_payload.sub);
                        return done(null, user);
                    } else {
                        console.log('user is not present');
                        
                        return done(null, false);
                        // or you could create a new account
                    }
                });
            }
        })
       
    }));
}
