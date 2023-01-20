const { Crop, CropSpecification, User, Category, Negotiation, Order, SubCategory } = require("../models");

const ModelIncludes = {

    IncludeCrop : {
        model: Crop,
        as: "crop",
        include:  [
            { model: CropSpecification, as: "specification" },
            { model: User, as: "user" },
            { model: Category, as: "category" },
            { model : SubCategory, as : "subcategory"}
        ]
    },

    IncludeNegotiation : {
        model : Negotiation,
        as : "negotiation",
        include : [
            { model: CropSpecification, where: { model_type: "negotiation" }, as: "specification", required: false },
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
        { model: CropSpecification, as: "specification" },
        { model: User, as: "user" },
        { model: Category, as: "category" },
        { model : SubCategory, as : "subcategory"}
    ],

    IncludeBuyer : {
        model : User,
        as : "buyer",
    },

    IncludeSpecification : {
        model : CropSpecification,
        as : "specification"
    }

};

module.exports = ModelIncludes;