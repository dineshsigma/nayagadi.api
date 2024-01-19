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




async function CreateBanners(req,res){
    try{
        let payload = req.body;
         payload.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let bannersTb = await db.collection('banners');//connect banners collections
        await bannersTb.insertOne(payload);
        return res.json({
            status:true,
            data:"banners inserted successfully"

        })

    }
    catch(error){
        console.log(error);
        return res.json({
            status:false,
            message:error
        })
    }
}

async function getBannerWithProductDetails(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let bannersTb = await db.collection('banners');//connect banners collections
        let productTb = await db.collection('product');
        let getBannerProductResponse = await bannersTb.find({}).sort({"weight":-1}).toArray();
         for(var i=0;i<getBannerProductResponse.length;i++){
           
            let productDetails = await productTb.aggregate([
                 {
                    $lookup: {
                        from: "productBrands",//child table name
                        localField: "products_brand",//parent table field
                        foreignField: "id",//chils field name
                        as: "productBrands",
    
                    }
                },
               
               
                {
                    $match: { id: `${getBannerProductResponse[i].productId}` }
                }

                
    
            ]).toArray();
            
            getBannerProductResponse[i].productDetails = productDetails[0]

         }
         return res.json({
            status:true,
            data:getBannerProductResponse

        })

    }
    catch(error){
        console.log("error-----",error);
        return res.json({
            status:false,
            message:error
        })
    }
}



module.exports.CreateBanners = CreateBanners;
module.exports.getBannerWithProductDetails = getBannerWithProductDetails;