const { AccessToken, User } = require("~database/models");
const jwt = require("jsonwebtoken");
const GlobalUtils = require("~utilities/global");
class AuthMiddleware {

    isGuest(req, res) {
        let headers = req.headers;
        if (headers.authorization) {
            // res.status(400);
            // res.send('Not allowed');
        }
    }

    async isAuthenticated(req, res) {
        let headers = req.headers;
        let auth = headers.authorization;
        try {
           
            if (auth) {
                var error = "";
                const decoded = jwt.verify(auth, process.env.TOKEN_KEY);
                var getToken = await AccessToken.findAll({ where: { user_id: decoded.user_id } });
                var user = await User.findByPk(decoded.user_id);
                req.global = { user: user };
                var tokenFound = false;
                if (getToken) {
                    getToken.forEach(item => {
                        tokenFound = item.token == auth ? true : tokenFound;
                    })
                }
                if (!tokenFound) {
                    res.status(403);
                    res.send('Unauthorized');
                }
            } else {
                res.status(403);
                res.send('Forbidden');
            }
        }
        catch (error) {
            if (error.name == "TokenExpiredError") {
                res.status(403);
                res.send('Expired');
            } else {
                res.status(403);
                res.send('Forbidden');
            }
        }

    }

    isLandingRefered(req, res) {
        let headers = req.headers;
        var refererUrl = headers.referer;
        if (!refererUrl.includes("growsel.com")) {
            return res.status(400).json({
                message: "Invalid referer"
            });
        }
    }
}

module.exports = new AuthMiddleware();