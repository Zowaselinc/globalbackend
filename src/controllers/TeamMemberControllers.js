
const { validationResult } = require('express-validator');
const { TeamMember, ErrorLog } = require('~database/models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const Mailer = require('~services/mailer');

class TeamMemberController {

    /* ------------------------- REGISTER A TEAM MEMBER ------------------------- */
    static async registerTeamMember(req, res) {

        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }
            const body = req.body;
            var userData = req.global.user;
            //RANDOM GENERATED PASSWORD
            const generatePassword = (
                length = 20,
                wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
            ) =>
                Array.from(crypto.randomFillSync(new Uint32Array(length)))
                    .map((x) => wishlist[x % wishlist.length])
                    .join('')



            var save = await TeamMemberController.saveMember(body, generatePassword(), userData);
            if (save) {

                Mailer()
                    .to(save.email).from(process.env.MAIL_FROM)
                    .subject('Team Account Credentials').text(`Email: ${save.email} \n Password ${generatePassword()}`).send();

                return res.status(200).json({
                    error: false,
                    messgae: "Team Member Account Created Successfully, Check Mail for Login Credentials",

                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "An Error Occured"
                });
            }

        } catch (e) {

            var logError = await ErrorLog.create({
                error_name: "Error on Team Member Route",
                error_description: e.toString(),
                route: req.route.path,
                error_code: "500",
            });
        }
    }
    static async saveMember(data, password, user) {
        var member;
        let encryptedPassword = await bcrypt.hash(password, 10);
        try {
            member = await TeamMember.create({
                user_id: user.id,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: encryptedPassword,
            });

        } catch (e) {

            user = {
                error: true,
                message: e.sqlMessage
            }
        }

        return member;
    }
}

module.exports = TeamMemberController;