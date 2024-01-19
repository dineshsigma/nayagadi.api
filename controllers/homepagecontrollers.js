const res = require("express/lib/response");
var mongo = require("../db.js");
var cors = require('cors');
let express = require('express');
let app = express();
const { v4: uuidv4 } = require('uuid');
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

async function Aboutus(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let AboutTb = await db.collection('About');
        let aboutusResponse = await AboutTb.find({}).toArray();
        return res.json({
            status:true,
            data:aboutusResponse

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

async function getFAQS(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let FAQTb = await db.collection('faqs');
        let FAQSResponse = await FAQTb.find({}).toArray();
        return res.json({
            status:true,
            data:FAQSResponse

        })

    }
    catch(error){
        console.log("error---",error);
    }
}

async function Blogs(req,res){
    try{
        let page=req.query.page;
        let db = await mongo.connect();//database connection 
        let BlogsTb = await db.collection('blogs');
        let blogsResponse = await BlogsTb.find({}).skip(5 * (page - 1)).limit(5).toArray();
        let noofBlogs = await BlogsTb.find({}).toArray();
        return res.json({
            status:true,
            TotalBlogs:noofBlogs.length,
            data:blogsResponse

        })

    }
    catch(error){
        console.log("error---",error);
        return res.json({
            status:true,
            message:error
        })
    }

}

//
async function News(req,res){
    try{
        let page = req.query.page;
        let db = await mongo.connect();//database connection 
        let NewsTb = await db.collection('news');
        let NewsResponse = await NewsTb.aggregate([
            {
                $lookup: {
                    from: "product",//child table name
                    localField: "model",//parent table field
                    foreignField: "id",//chils field name
                    as: "productList"
                }
            },
            { $skip: 5 * (page - 1) },
            { $limit: 5 },
            // { $sort: { "weight": 1 } }
        ]).toArray()
        let noofNews = await NewsTb.find({}).toArray();
        return res.json({
            status:true,
            TotalNews:noofNews.length,
            data:NewsResponse

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

async function getNewsById(req,res){
    let id=req.query.id
    try{
        let db = await mongo.connect();//database connection 
        let NewsTb = await db.collection('news');
        let NewsResponse = await NewsTb.aggregate([
            {
                $lookup: {
                    from: "product",//child table name
                    localField: "model",//parent table field
                    foreignField: "id",//chils field name
                    as: "productList"
                }
            },
            {
                $match:{ "id":{$eq: id },}
            }
        ]).toArray()
        let Views=NewsResponse[0].Views
        await NewsTb.findOneAndUpdate({"id":id},{$set:{"Views":Views+1}})
        return res.json({
            status:true,
            data:NewsResponse
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

async function getBlogsById(req,res){
    
    try{
        let db = await mongo.connect();//database connection 
        let BlogsTb = await db.collection('blogs');
        let BlogsResponse = await BlogsTb.findOne({"id":req.query.id});
         let Views=BlogsResponse.Views
         await BlogsTb.findOneAndUpdate({"id":req.query.id},{$set:{"Views":Views+1}})
        return res.json({
            status:true,
            data:BlogsResponse
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

//search vehicles in homepage

async function searchVehiclesWithLogos(req,res){
    
    try{
        let page=req.query.page
       
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let query={};
        let noofProducts;
        if(req.query.car_type!=undefined && req.query.car_type!="" && req.query.car_type!=null && req.query.car_type!='undefined'){
            query.car_type=req.query.car_type
            noofProducts= await productTb.find(query).toArray();
            
        }
        if(req.query.priceRange!=undefined && req.query.priceRange!="" && req.query.priceRange!=null && req.query.priceRange!='undefined'){
            query.priceRange=req.query.priceRange
            noofProducts= await productTb.find(query).toArray();
        }
        if(req.query.products_brand!=undefined && req.query.products_brand!="" && req.query.products_brand!=null && req.query.products_brand!='undefined'){
            query.products_brand=req.query.products_brand
            noofProducts= await productTb.find(query).toArray();
        }
        if(req.query.fuel_types!=undefined && req.query.fuel_types!="" && req.query.fuel_types!=null && req.query.fuel_types!='undefined'){
            query.fuel_types=req.query.fuel_types
            noofProducts= await productTb.find(query).toArray();
        }
        if(req.query.id!=undefined && req.query.id!="" && req.query.id!=null && req.query.id!='undefined'){
            query.id=req.query.id
            noofProducts= await productTb.find(query).toArray();
        }

        console.log("quert---",query);
        

       
        
        let searchVehiclesResponse = await productTb.aggregate([

            {
                $lookup: {
                    from: 'modelVarient',
                    localField: 'variants',
                    foreignField: 'id',
                    as: 'ModelVariantNameList'
                }
            },
            {
                $lookup: {
                    from: "cartype",//child table name
                    localField: "car_type",//parent table field
                    foreignField: "id",//chils field name
                    as: "cartype",
                    
                }
            },
            {
                $lookup: {
                    from: "productBrands",//child table name
                    localField: "products_brand",//parent table field
                    foreignField: "id",//chils field name
                    as: "productBrands",
                    
                }
            },
            {
                $lookup: {
                    from: "fuelType",//child table name
                    localField: "fuel_types",//parent table field
                    foreignField: "id",//chils field name
                    as: "fuelType",
                    
                }
            },
            
            {
                $match: {"$and":[
                    query

                   ]}
            },
            { $skip : 5 * (page-1)},
                {$limit:5},
                {$sort:{"weight":1}}

        ]).toArray();
        

        return res.json({
            status:true,
            TotalProducts:noofProducts.length,
            data:searchVehiclesResponse
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

//group by brands with varients

async function groupByBrandsWithvarients(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('modelVarient');//connect product collection
        let searchPriceWithCarType = await productTb.aggregate([

            {
                $lookup: {
                    from: "productBrands",//child table name
                    localField: "product_brand",//parent table field
                    foreignField: "id",//chils field name
                    as: "productBrand"
                }
            },{$group :
                {"_id" :"$product_brand","listOfVarients": { "$push": "$$ROOT" }},
            },
            {$project:{listOfVarients:{$slice:["$listOfVarients", 2]}}}
            

        ]).toArray()

        return res.json({
            status:true,
            data:searchPriceWithCarType

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

async function logs(req,res){
    let payload =req.body;
    payload.id = uuidv4();
    try{
        let db = await mongo.connect();//database connection 
        let logoTb = await db.collection('bodylogos');//connect logo collection
        await logoTb.insertOne(payload);
        return res.json({
            status:true,
            message:'logo addedd success'

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

async function getbrandLogosBasedOnCategory(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let productBrandsTb = await db.collection('productBrands');//connect productBrands collection
        let getproductBrandsData = await productBrandsTb.find({"CategoryType":req.query.category}).toArray();
        return res.json({
            status:true,
            data:getproductBrandsData
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

async function getCarTypeBasedOnBrand(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let bodylogoTb = await db.collection('bodylogos');//connect bodylogo collection
        let carlogoResponse = await bodylogoTb.aggregate([

            {
                $lookup: {
                    from: 'productBrands',
                    localField: 'product_brands',
                    foreignField: 'id',
                    as: 'brandList'
                }
            },
            {
                $lookup: {
                    from: 'cartype',
                    localField: 'car_type',
                    foreignField: 'id',
                    as: 'cartypeList'
                }
            },{
                $match:{"product_brands":{$eq:req.query.product_brands}}
            }
        ]).toArray();
        return res.json({
            status:true,
            data:carlogoResponse
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


//list of fuel type

async function listofFuelTypes(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let fuelTypeTb = await db.collection('fuelType');//connect bodylogo collection
        let fueltyperesponse = await fuelTypeTb.find({}).toArray();
        return res.json({
            status:true,
            data:fueltyperesponse
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

//get modelName(productName) based on brands,cartype

async function getModelNameBasedOnBrandAndCarType(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let bodylogoTb = await db.collection('bodylogos');//connect bodylogo collection
        let bodylogosResponse = await bodylogoTb.aggregate([

            {
                $lookup: {
                    from: 'product',
                    localField: 'productId',
                    foreignField: 'id',
                    as: 'productList'
                }
            },
            
            
           
            
            {
                $match: {
                    "$and":[
                        {"product_brands":{$eq:req.query.product_brands}},
                        {"car_type":{$eq:req.query.car_type}}
                       ]

                }
            }

        ]).toArray()

        return res.json({
            status:true,
            data:bodylogosResponse
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

async function ListOfCategory(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let categoryTb = await db.collection('category');//connect bodylogo collection
        let categoryResponse = await categoryTb.find({}).toArray();
        return res.json({
            status:true,
            data:categoryResponse

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


async function homePageAds(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let HomepageAdsTb = await db.collection('HomepageAds');//connect bodylogo collection
        let HomepageAdsTbResponse = await HomepageAdsTb.find({}).toArray();
        return res.json({
            status:true,
            data:HomepageAdsTbResponse

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



module.exports.Aboutus = Aboutus;
module.exports.getFAQS = getFAQS;
module.exports.Blogs= Blogs;
module.exports.News =News;
module.exports.getNewsById = getNewsById
module.exports.getBlogsById = getBlogsById
module.exports.searchVehiclesWithLogos = searchVehiclesWithLogos
module.exports.groupByBrandsWithvarients = groupByBrandsWithvarients
module.exports.logs = logs
module.exports.getbrandLogosBasedOnCategory = getbrandLogosBasedOnCategory
module.exports.getCarTypeBasedOnBrand = getCarTypeBasedOnBrand
module.exports.listofFuelTypes = listofFuelTypes
module.exports.getModelNameBasedOnBrandAndCarType = getModelNameBasedOnBrandAndCarType
module.exports.ListOfCategory = ListOfCategory

module.exports.homePageAds = homePageAds