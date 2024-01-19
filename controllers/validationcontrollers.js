const res = require("express/lib/response");
var mongo = require("../db.js");
var cors = require('cors');
let express = require('express');
let app = express();
const { v4: uuidv4 } = require('uuid');
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//valiadtion for models

async function modelValidations(req,res){
    try{
        let payload=req.body;
        let db = await mongo.connect();//database connection 
        let productTb = db.collection('product');//connect product collection
        let getmodelname = await productTb.findOne({"ProductName":payload.ProductName,"Category":payload.Category});
        let getslug = await productTb.findOne({"slug":payload.slug,"Category":payload.Category});
        if(payload.Category!=null && payload.Category!="" && payload.Category!=undefined){
            return res.json({status:false,"message":"category Field is mandatory"})
        }
        if(payload.products_brand!=null && payload.products_brand!="" && payload.products_brand!=undefined){
            return res.json({status:false,"message":"Brand Field is mandatory"})
        }
        if(payload.car_type!=null && payload.car_type!="" && payload.car_type!=undefined){
            return res.json({status:false,"message":"car_type Field is mandatory"})
        }
        if(getmodelname){
            return res.json({status:false,"message":"This Model is Already exits"})
        }
        if(payload.finalPrice < payload.initialPrice){
            return res.json({status:false,"message":"initialPrice is greater than  finalPrice"})
        }
        if(getslug){
            return res.json({status:false,"message":"This Slug is Already exits"})
        }
      return res.json({status:true,message:"success"})
        

    }
    catch(error){
        console.log(error);
        return res.json({
            status:false,
            message:error
        })
    }

}
module.exports.modelValidations = modelValidations