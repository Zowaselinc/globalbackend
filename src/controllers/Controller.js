

class Controller{

  
    static async testPostData(req,res){

        return res.status(400).json({
            error : true,
            message : "Could not create crop, invalid data sent",
            data : []
        })
    }

}

module.exports = Controller;
