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




async function latestNews(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let NewsTb = await db.collection('news');
        let latestNewsResponse = await NewsTb.find({},{sort:{_id:-1}}).limit(2).toArray();
        return res.json({
            status:true,
            data:latestNewsResponse
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


async function trendingNews(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let newsTb = await db.collection('news');
        let latestBlogsResponse = await newsTb.find({},{sort:{Views:-1}}).limit(2).toArray();
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
module.exports.latestNews =latestNews
module.exports.trendingNews = trendingNews