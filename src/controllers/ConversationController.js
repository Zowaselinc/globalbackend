const { Op } = require("sequelize");
const { IncludeCrop, IncludeNegotiation, IncludeNegotiations, IncludeLastNegotiations, IncludeLastNegotiation } = require("~database/helpers/modelncludes");
const { Conversation, ErrorLog, User, Crop, CropSpecification, Negotiation } = require("~database/models");

class ConversationController{

    /* ------------------------------ GET ALL Conversations ----------------------------- */
    static async getAllConversations(req,res){
        try{

            var getAllConversations = await Conversation.findAll({});

            if(getAllConversations){
                return res.status(200).json({
                    error:false,
                    message: "Conversations acquired successfully",
                    data: getAllConversations
                });

            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire conversations",
 
                });
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all conversations",
                error_description: e.toString(),
                route: "/api/conversation/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+e.toString(),
                })
    
            }
        }
    }



   
    // /* ----------------------------- GET Conversation BY userID ----------------------------- */
    static async getAllConversationsByUserID(req,res){
        try{

            const userId = req.params.userid;

            if (userId !== "" || userId !== null || userId !== undefined) {        
                const { count, rows } = await Conversation.findAndCountAll({
                    where: {
                        [Op.or]: [
                            { user_one: userId },
                            { user_two: userId }
                        ],
                        type: "negotiation",
                    },
                    order: [['id', 'DESC']],
                    include: [
                        { model: User, as: "initiator", required: true },
                        { model: User, as: "participant", required: true },
                        IncludeCrop,
                        // IncludeLastNegotiation
                    ],
                    group: ['id'],
                });
                

                if (rows.length > 0) {

                    return res.status(200).json({
                        error: false,
                        message: "Conversations retrieved successfully",
                        data: rows
                    })

                } else {

                    return res.status(200).json({
                        error: true,
                        message: "No conversation.",
                        data: rows
                    })

                }
            } else {
                return res.status(200).json({
                    error: true,
                    message: "Invalid user ID",
                    data: []
                })
            }

              

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting color by id",
                error_description: e.toString(),
                route: "/api/conversation/getbyuserid/:userid",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+e.toString(),
                });
            } 
        }
    }

}

module.exports = ConversationController;
