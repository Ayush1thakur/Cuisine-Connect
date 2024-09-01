const { CreateError } = require("./ErrorHandling");

const authentocateuser=(req,res,next)=>{
    let user=req.user; //made in userpresent.js middleware
    let password=req.body.password;
    let email = req.body.email;
    if(password==user.password && email==user.email){
        next();
    }
    else{
        next(CreateError(401,"unauthorized user ")); //status code 401 fir unauthorized user 
    }
}

module.exports=authentocateuser;