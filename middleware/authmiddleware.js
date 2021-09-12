const jwt = require('jsonwebtoken');
const User = require('../models/usermodels')

const currentUser = (req, res, next)=>{
    const token = req.cookies.jwt;

    //check json web token exist & is-verified
    if (token){
        jwt.verify(token, 'beta@master', async (err, decodedToken)=>{
            if(err){
                res.locals.user = null;
                next();  
            }else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = {currentUser};