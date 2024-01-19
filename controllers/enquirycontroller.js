let express = require('express');
let app=express();
var mongo = require("../db.js");
var cors = require('cors');
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//----------------create Enquiry form in homepage---------------------
async function CreateEnquiryForm(req,res){
    try{
        let payload = req.body.payload;
        payload.createdOn=new Date();
        let db = await mongo.connect();//database connection 
        let enquiryTb = db.collection('enquiry');//connect enquiry collection
        await enquiryTb.insertOne(payload);
        return res.json({
            status:true,
            data:'Enquiry Form  Added Sucessfully '
        })

    }
    catch(error){
        console.log("error",error);
        return res.json({
            status:false,
            message:error
        })
       
    }
}



module.exports.CreateEnquiryForm = CreateEnquiryForm