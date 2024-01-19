const res = require("express/lib/response");
var mongo = require("../db.js");
var cors = require('cors');
let express = require('express');
let app = express();
const { v4: uuidv4 } = require('uuid');
app.use(cors())
app.options("*", cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);


async function createFooter(req,res){
    try{
        let form=req.body;
        form.id= uuidv4();
        let db = await mongo.connect();//database connection
        let footerTb = await db.collection('footer');//connect footer collection
        await footerTb.insertOne(form);
        return res.json({
            status:true,
            data:'footer created successfully'
        })

    }
    catch(error){
        console.log("error--",error);
        return res.json({
            status:false,
            message:error
        })
    }
}

async function getFooterDetails(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let footerTb = await db.collection('footer');
        let footerResponse = await footerTb.find({}).toArray();
        return res.json({
            status:true,
            data:footerResponse
        })

    }
    catch(error){
        console.log("error---",error);
        return res.json({
            status:false,
            message:error
        })
    }
}

//Terms And Conditions Api

 async function TermsAndCondition(req,res){
     try{
        let db = await mongo.connect();//database connection 
        let TermsAndCondition = await db.collection('terms_conditions');
        let gettermsAndConditionResponse = await TermsAndCondition.find({}).toArray();
        return res.json({
            status:true,
            data:gettermsAndConditionResponse

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

 //privarcy policy  

 async function PrivacyPolicy(req,res){
     try{
        let db = await mongo.connect();//database connection 
        let PrivacyPolicy = await db.collection('privacyPolicy');
        let PrivacyPolicyResponse = await PrivacyPolicy.find({}).toArray();
        return res.json({
            status:true,
            data:PrivacyPolicyResponse
        })

     }
     catch(error){
         console.log("error---",error);
         return res.json({
             status:false,
             message:error
         })
     }
 }

 //contact Us

 async function contactUs(req,res){
     try{
         let form = req.body.payload;
         form.createdOn = new Date();
        let db = await mongo.connect();//database connection 
        let contactUsTb = await db.collection('contactUs');//connect contact us collection
        await contactUsTb.insertOne(form);
        return res.json({
            status:true,
            message:"Your Details Addedd successfully"
        })


     }
     catch(error){
         console.log("error---",error);
         return res.json({
             status:false,

         })
     }
 }

 //carrers

 async function carrers(req,res){
     try{
        let db = await mongo.connect();//database connection 
        let carrersTb = await db.collection('carrers');
        let carrersResponse = await carrersTb.find({}).toArray();
        return res.json({
            status:true,
            data:carrersResponse
        })

     }
     catch(error){
         console.log("error---",error);
         return res.json({
             status:false,
             message:error
         })
     }
 }

 //careers by id

 async function careersByid(req,res){
     try{
        let db = await mongo.connect();//database connection 
        let carrersTb = await db.collection('carrers');
        let carrersResponse = await carrersTb.findOne({"id":req.query.id});
        return res.json({
            status:true,
            data:carrersResponse

        })

     }
     catch(error){
         console.log("error---",error);
         return res.json({
             status:false,
             message:'error'
         })
     }
 }

module.exports.createFooter = createFooter;
module.exports.getFooterDetails = getFooterDetails
module.exports.TermsAndCondition = TermsAndCondition
module.exports.PrivacyPolicy = PrivacyPolicy
module.exports.contactUs = contactUs
module.exports.carrers = carrers
module.exports.careersByid = careersByid