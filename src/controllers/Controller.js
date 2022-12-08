

class Controller{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello There"
        });
    }

}

module.exports = Controller;
