
const jwt = require("jsonwebtoken");
const { User, Company, AccessToken, Merchant, Partner } = require("~models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');


class AuthController{

    static async login(req, res){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        let user = await User().where({email : data.email}).first();

        if(!user){
           return res.status(400).json({
            error : true,
            message : "Invalid credentials"
           });
        }

        let merchant = await Merchant().where({user_id : user._uniqueKey}).first();
        let partner = await Partner().where({user_id : user._uniqueKey}).first();
        
        if(merchant){  user.merchant = merchant  }
        if(partner){  user.partner = partner  }

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

    static async registerMerchantBuyer( req, res ){

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

        var merchant = Merchant();
        merchant.user_id = user._uniqueKey;
        await merchant.save().catch((error => {
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

        // Mailer()
        // .to(data.email).from("hello@ctrixx.com")
        // .subject('Verify Email').template('emails.verifyEmail').send();

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

        // Mailer()
        // .to(data.email).from("hello@ctrixx.com")
        // .subject('Verify Email').template('emails.verifyEmail').send();

        
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

        // Mailer()
        // .to(data.email).from("hello@ctrixx.com")
        // .subject('Verify Email').template('emails.verifyEmail').send();
        
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

}

module.exports = AuthController;