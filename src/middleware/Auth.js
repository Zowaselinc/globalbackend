
class AuthMiddleware{

    isGuest(req,res){
        console.log('Yes');
        //res.send("Failed");
    }

    isVerified(req,res){
        console.log("Verified");
    }
}

module.exports = new AuthMiddleware();