
class AuthMiddleware{

    isGuest(req,res){
        let headers = req.headers;
        if(headers.authorization){
            res.status(400);
            res.send('Not allowed');
        }
    }

    isAuthenticated(req,res){
        let headers = req.headers;
        let auth =  headers.authorization;
        if(auth){
            //const decoded = jwt.verify(, process.env.TOKEN_KEY);
        }else{
            res.status(403);
            res.send('Forbidden');
        }
    }
}

module.exports = new AuthMiddleware();