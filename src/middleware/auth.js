const { AccessToken } = require("~database/models");
const jwt = require("jsonwebtoken");
class AuthMiddleware{

    isGuest(req,res){
        let headers = req.headers;
        if(headers.authorization){
            // res.status(400);
            // res.send('Not allowed');
        }
    }

    async isAuthenticated(req,res){
        let headers = req.headers;
        let auth =  headers.authorization;
        try{
            if(auth){
                const decoded = jwt.verify(auth, process.env.TOKEN_KEY);
                var getToken = await AccessToken.findOne({ where : {user_id : decoded.user_id}});
                getToken = getToken ? getToken.dataValues : {};
                if(getToken.token != auth){
                    res.status(403);
                    res.send('Unauthorized');
                }
            }else{
                res.status(403);
                res.send('Forbidden');
            }
        }
        catch(error){
            res.status(403);
            res.send('Forbidden');
        }

    }
}

module.exports = new AuthMiddleware();