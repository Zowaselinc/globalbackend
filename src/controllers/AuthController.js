
const jwt = require("jsonwebtoken");
const { User, Company, AccessToken, Merchant, Partner, Buyer, Agent, UserCode, Pricing } = require("~models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const { buyers } = require("~database/models");
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");


class AuthController{

 /* -------------------------------------------------------------------------- */
 /*                                    login                                   */
 /* -------------------------------------------------------------------------- */


    static async login(req, res){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        let user = await User().where({email : data.email}).first();
console.log(user);
        if(!user){
           return res.status(400).json({
            error : true,
            message : "Invalid credentials"
           });
        }

        let merchant = await Merchant().where({user_id : user._uniqueKey}).first();
        let partner = await Partner().where({user_id : user._uniqueKey}).first();
        let agent = await Agent().where({user_id : user._uniqueKey}).first();
        let buyer = await Buyer().where({user_id : user._uniqueKey}).first();
        
        if(merchant){  user.merchant = merchant  }
        if(partner){  user.partner = partner  }
        if(buyer){  user.buyer = buyer  }
        if(agent){  user.agent = agent  }

        let passwordCheck =  await bcrypt.compare(data.password, user.password)

        if(passwordCheck){

            const token = jwt.sign(
                {user_id: user._uniqueKey},
                process.env.TOKEN_KEY,
                {expiresIn: "48h"}
            );
    
            await AuthController.saveToken(user,token);

            return res.status(200).json({
                error : false,
                message : "Login Successful",
                token : token,
                user : user
               });

        }else{
            return res.status(400).json({
                error : true,
                message : "Invalid credentials"
               });
        }



    }

        /* -------------------------------------------------------------------------- */
        /*                              register marchant                             */
        /* -------------------------------------------------------------------------- */

    static async registerMerchantBuyer( req, res ){

        const errors = validationResult(req);
        console.log(errors)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        let user = await AuthController.saveUser(data);

        if(user.error){
            return res.status(400).json({
                error : true,
                message : user.message
            });
        }

        if(data.has_company){
            var response = await AuthController.saveCompany(user,data);
            if(response.error){
                await user.delete();
                return res.status(400).json({
                    error : true,
                    message : response.message
                });
            }
        }

        var UserTypeModel = data.user_type == "merchant" ? Merchant() : Buyer();
        UserTypeModel.user_id = user._uniqueKey;
        await UserTypeModel.save().catch((error => {
            return res.status(400).json({
                error : true,
                message : error.sqlMessage
            });
        }));
        
        const token = jwt.sign(
            {user_id: user._uniqueKey},
            process.env.TOKEN_KEY,
            {expiresIn: "48h"}
        );

        await AuthController.saveToken(user,token);

        Mailer()
        .to(data.email).from("hello@ctrixx.com")
        .subject('Welcome').template('emails.WelcomeEmail').send();

        res.status(200).json({
            status : true,
            token : token,
            user : user
        });

    }

    static async registerAgent( req, res ){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        let user = await AuthController.saveUser(data);

        if(user.error){
            return res.status(400).json({
                error : true,
                message : user.message
            });
        }

        var save = await AuthController.saveCompany(user,data);
        if(save.error){
            await user.delete();
            return res.status(400).json({
                error : true,
                message : save.message
            });
        }

        var agent = Agent();
        agent.user_id = user._uniqueKey;
        agent.agent_type = data.agent_type;
        await agent.save().catch((error => {
            return res.status(400).json({
                error : true,
                message : error.sqlMessage
            });
        }));;

        Mailer()
        .to(data.email).from("hello@ctrixx.com")
        .subject('Welcome').template('emails.WelcomeEmail').send();

        
        const token = jwt.sign(
            {user_id: user._uniqueKey},
            process.env.TOKEN_KEY,
            {expiresIn: "48h"}
        );

        await AuthController.saveToken(user,token);

        res.status(200).json({
            status : true,
            token : token,
            user : user
        });

    }

/* -------------------------------------------------------------------------- */
/*                              register partner                              */
/* -------------------------------------------------------------------------- */

    static async registerPartner( req, res ){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        let user = await AuthController.saveUser(data);

        if(user.error){
            return res.status(400).json({
                error : true,
                message : user.message
            });
        }

        var save = await AuthController.saveCompany(user,data);
        if(save.error){
            await user.delete();
            return res.status(400).json({
                error : true,
                message : save.message
            });
        }

        var partner = Partner();
        partner.user_id = user._uniqueKey;
        partner.partnership_type = data.partnership_type;
        await partner.save().catch((error => {
            return res.status(400).json({
                error : true,
                message : error.sqlMessage
            });
        }));;

        Mailer()
        .to(data.email).from("hello@ctrixx.com")
        .subject('Welcome').template('emails.WelcomeEmail').send();
        
        const token = jwt.sign(
            {user_id: user._uniqueKey},
            process.env.TOKEN_KEY,
            {expiresIn: "48h"}
        );

        await AuthController.saveToken(user,token);

        return res.status(200).json({
            status : true,
            token : token,
            user : user
        });

    }

    static async saveUser(data){
        let user = User();

        user.first_name = data.first_name;
        user.last_name = data.last_name;
        user.phone = data.phone;
        user.email = data.email;
        user.is_verified = 0;
        user.status = 1;
        let encryptedPassword = await bcrypt.hash(data.password, 10);
        user.password = encryptedPassword;

        try{
            await user.save();
        }catch(e){
            user = {
                error : true,
                message : e.sqlMessage
            }
        }

        return user;
    }

    static async savePricing(data){
        let pricing = Pricing();

        pricing.user_id = data.userId;
        pricing.client_id = data.clientId;
        pricing.package = data.type;
      
        try{  
            await pricing.save();
        }catch(e){
            pricing = {
                error : true,
                message : e.sqlMessage
            }
        }

        return pricing;
    }

    static async saveCompany(user,data){
        let company = Company();

        company.user_id = user._uniqueKey;
        company.company_name = data.company_name;
        company.company_address = data.company_address;
        company.company_phone = data.company_phone;
        company.company_email = data.company_email;
        company.state = data.company_state;
        company.rc_number = data.rc_number;

        try{
            await company.save();
        }catch(e){
            company = {
                error : true,
                message : e.sqlMessage
            }
        }

        return company;
    }

    static async saveToken(user,token){

        let accessToken = AccessToken();
        accessToken.user_id = user._uniqueKey;
        accessToken.client_id = 1;
        accessToken.token = token;
        let expiry = new Date();
        expiry.setDate( expiry.getDate() + 2);
        accessToken.expires_at = expiry.toISOString().slice(0, 19).replace('T', ' ');;

        try{
            await accessToken.save();
        }catch(e){
            accessToken = {
                error : true,
                message : e.sqlMessage
            }
        }


    }

    static async sendVerificationCode(req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }

        var code = getRandomInt(100000,999999);

        //Check for exixting
        var formerCode = await UserCode().where({email : data.email, type : "verification"}).first();

        if(!formerCode){
            var userCode = UserCode();

            userCode.email = data.email;
            userCode.type = "verification";
            userCode.code = code;
            userCode.save().catch(error => {
                console.log(error.sqlMessage)
            });
        }else{
            formerCode.code = code;
            formerCode.save().catch(error => {
                console.log(error.sqlMessage)
            });
        }




        Mailer()
        .to(data.email).from("hello@ctrixx.com")
        .subject('Verify').template('emails.OTPEmail',{code : code}).send();


        return res.status(200).json({
            status : true,
            message : "Code sent successfully"
        });

    }

    static async verifyCode(req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        var userCode = await UserCode().where({email : data.email, type : "verification"}).first();

        if(userCode.code == data.code){
            return res.status(200).json({
                status : true,
                message : "Code verified successfully"
            });
        }else{
            return res.status(400).json({
                error : true,
                message : "Invalid code"
            });
        }



    }

    static async sendResetEmail(req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }

        var code = getRandomInt(10000000,99999999);

        var user = await User().where({ email : data.email}).first()

        if(!user){
            return res.status(400).json({
                error : true,
                message : "A user with this email does not exist"
            });
        }

        var resetToken = md5(code);

        //Check for exixting
        var formerCode = await UserCode().where({email : data.email, type : "reset"}).first();

        if(!formerCode){
            var userCode = UserCode();

            userCode.email = data.email;
            userCode.type = "reset";
            userCode.code = resetToken;
            userCode.save().catch(error => {
                console.log(error.sqlMessage)
            });
        }else{
            formerCode.code = resetToken;
            formerCode.save().catch(error => {
                console.log(error.sqlMessage)
            });
        }

        Mailer()
        .to(data.email).from("hello@ctrixx.com")
        .subject('Reset Password').template('emails.ResetEmail',{code : resetToken}).send();


        res.status(200).json({
            status : true,
            message : "Code sent successfully"
        });

    }

    static async verifyResetToken(req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        var userCode = await UserCode().where({ code : data.token}).first();

        if(!userCode){
            res.status(400).json({
                status : false,
                message : "Invalid token"
            });
        }

        res.status(200).json({
            status : true,
            message : "Valid token"
        });

    }

    static async resetPassword(req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        var getCode = await UserCode().where({ code : data.token , type : "reset"}).first();

        if(!getCode){
            return res.status(400).json({
                error : true,
                message : "Invalid reset request"
            });
        }

        var user = await User().where({ email : getCode.email}).first();

        if(!user){
            return res.status(400).json({
                error : true,
                message : "A user with this email does not exist"
            });
        }

        let encryptedPassword = await bcrypt.hash(data.password, 10);
        
        user.password = encryptedPassword;
        user.save();

        res.status(200).json({
            status : true,
            message : "Password reset successfully"
        });

    }
    
    static async pricing(req, res){
        const errors = validationResult(req);
        console.log(errors.array());
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const data = req.body;
        console.log(data);

        let pricingObjModel = await AuthController.savePricing(data);
        console.log(pricingObjModel);
        if(!pricingObjModel){
            return res.status(400).json({
             error : true,
             message : "Invalid request"
            });
         }else{
            return res.status(200).json({
                error : false,
                message : "Successful Selected Pricing Plan"
            })
         }

        


    }
}

module.exports = AuthController;