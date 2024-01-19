const res = require("express/lib/response");
var mongo = require("../db.js");
var cors = require('cors');
let express = require('express');
let app = express();
const { v4: uuidv4 } = require('uuid');
app.use(cors())
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);


//User add  Reviews for models

async function modelReviews(req,res){
    try{
        let form=req.body;
        form.createdOn = new Date();
        let db = await mongo.connect();//database connection 
        let modelReviewsTb = await db.collection('modelReviews');
        await modelReviewsTb.insertOne(form);
        return res.json({
            status:true,
            message:"review addedd successfully"
        })
       
       

    }
    catch(error){
        console.log("error----",error);
        return res.json({
            status:false,
            message:error
        })
    }
}

//get modelReviews based on productIds

async function getModelReviews(req,res){
    console.log(req.query);
    try{
        let db = await mongo.connect();//database connection 
        let modelReviewsTb = await db.collection('modelReviews');
         let getModelReviews = await modelReviewsTb .aggregate([
            { "$match": { "productId": req.query.productId } },
            { "$group": {
                _id: "$productId",
               avgReview: { $avg: "$review" },
                "COUNT(*)": {"$sum": 1}
             }, }
        ]).toArray()
         return res.json({
             status:true,
             data:getModelReviews
         })
         

    }
    catch(error){
        console.log("error----",error);
        return res.json({
            status:false,
            message:error
        })
    }
}

module.exports.modelReviews = modelReviews;
module.exports.getModelReviews = getModelReviews;