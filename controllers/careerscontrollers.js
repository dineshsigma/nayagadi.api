const res = require("express/lib/response");
var mongo = require("../db.js");

let express = require('express');
let app = express();
const { v4: uuidv4 } = require('uuid');
var cors = require('cors');
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var awsmodule = require('../modules/aws')
var AWS = require('aws-sdk');


async function getUploadUrl(req,res){
    let form =req.body;
    try{
        try{
            // var table_id = req.body.table_id;
            var filename = req.body.filename;
            let folder_type = req.body.folder_type;//resumes
            var folderpath;
            folderpath = `carrers/${folder_type}`
       
          var url =  await awsmodule.getSignedUrl(folderpath,filename,'putObject');
        res.json({"status":true,message:"path fetched successfully","data":url,folderpath:folderpath})
        }catch(error){
            console.log(error)
            res.json({"status":false,message:"something went wrong please try again",error:error.message})
        }
        
    }
    catch(error){
        console.log("error---",error);
        return res.json({
            status:false,
            message:error
        })
    }

}


async function applyCareersJob(req,res){
    
    
    try{
        let form = req.body;
        let db = await mongo.connect();//database connection 
        let carrersApplyJobsTb = await db.collection('carrersApplyJobs');
        await carrersApplyJobsTb.insertOne(form);
        return res.json({
            status:true,
            message:"User Details Upload Successfully"
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

module.exports.getUploadUrl = getUploadUrl
module.exports.applyCareersJob =applyCareersJob