const { Crop, CropSpecification, User, Category, Negotiation, Order } = require("../models");

const ModelIncludes = {

    IncludeCrop : {
        model: Crop,
        as: "crop",
        include: [
            { model: CropSpecification, as: "specification" },
            { model: User, as: "user" },
            { model: Category, as: "category" }
        ]
    },
    
    IncludeNegotiations : {
        model: Negotiation,
        as: "negotiations",
        include: [
            { model: CropSpecification, where: { model_type: "negotiation" }, as: "specification", required: false },
            { model: Order, as: "order",required: false }
        ],
        order: [['id', "DESC"]],
    },

    CropIncludes : [
        
    ]

};

module.exports = ModelIncludes;