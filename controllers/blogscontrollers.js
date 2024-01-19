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




async function latestBlogs(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let BlogsTb = await db.collection('blogs');
        let latestBlogsResponse = await BlogsTb.find({},{sort:{_id:-1}}).limit(2).toArray();
        return res.json({
            status:true,
            data:latestBlogsResponse
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

async function trendingBlogs(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let BlogsTb = await db.collection('blogs');
        let latestBlogsResponse = await BlogsTb.find({},{sort:{Views:-1}}).limit(2).toArray();
        return res.json({
            status:true,
            data:latestBlogsResponse
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


module.exports.latestBlogs =latestBlogs;
module.exports.trendingBlogs = trendingBlogs;