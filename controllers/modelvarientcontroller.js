let express = require('express');
const res = require('express/lib/response');
let app = express();
var mongo = require("../db.js");
const { v4: uuidv4 } = require('uuid');
var cors = require('cors');
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var PhoneNumber = require('awesome-phonenumber');
var taxLocation = require('../modules/taxcalculation')
//create varients APis
async function createModelVarient(req, res) {
    try {
        let payload = req.body;
        payload.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let modelVarientTb = db.collection('modelVarient');//connect modelvarient collection
        await modelVarientTb.insertOne(payload);
        return res.json({
            status: true,
            message: "model varients successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }
}
//create productBrands Apis
async function createBrands(req, res) {
    try {
        let payload = req.body;
        payload.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let modelVarientTb = db.collection('productBrands');//connect modelvarient collection
        await modelVarientTb.insertOne(payload);
        return res.json({
            status: true,
            message: "brands varients successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }
}
//create fuelType Apis
async function createFuelType(req, res) {
    try {
        let payload = req.body;
        payload.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let modelVarientTb = db.collection('fuelType');//connect modelvarient collection
        await modelVarientTb.insertOne(payload);
        return res.json({
            status: true,
            message: "fuel addedd successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }
}
//create Features Apis
async function createFeatures(req, res) {
    try {
        let payload = req.body;
        payload.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let modelVarientTb = db.collection('features');//connect modelvarient collection
        await modelVarientTb.insertOne(payload);
        return res.json({
            status: true,
            message: "features addedd successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }
}
//get modelVarient by id
async function getModelVarient(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');
        let modelVarientResponse = await modelVarientTb.findOne({
            "id": req.query.id
        })
        return res.json({
            status: true,
            message: modelVarientResponse
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }
}

//get ALL Brand Details
async function ListOfBrandnames(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let productBrandTb = await db.collection('productBrands');
        let brandResponse = await productBrandTb.find({}).toArray();
        return res.json({
            status: true,
            data: brandResponse

        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }
}

//based on brand names to get model varient data

async function getListOfModelVarients(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');//connect model varient table
        let modelvarientDetails = await modelVarientTb.find({ "product_brand": req.query.product_brand }).toArray();



        return res.json({
            status: true,
            data: modelvarientDetails
        })

    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            sttaus: false,
            message: error
        })
    }

}
//get modelVarients By id 
async function getModelVarientsById(req, res) {
   
    try {
        let ModelVariantName = req.query.ModelVariantName
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');//connect model varient table
        let modelvarientDetails = await modelVarientTb.aggregate([
            {
                $lookup: {
                    from: "productBrands",//child table name
                    localField: "product_brand",//parent table field
                    foreignField: "id",//chils field name
                    as: "productList"
                }
            },
            {
                $match: { "id": { $eq: ModelVariantName }, }
            },
         ]).toArray();
        

       
        let LocationTaxTb = await db.collection('LocationTax');//connect LOCATION TAX table
        let modelvarientTb = await db.collection('modelVarient');//connect LOCATION TAX table
        let cityTb = await db.collection('LocationTax')
        let locationtaxprices;
        let varientsEnginee;
        let varientPrices;

        locationtaxprices = await taxLocation.taxLocation(req.query);
        let varientTaxDetails = await taxLocation.taxCalculation(locationtaxprices,req.query.ModelVariantName, modelvarientDetails);
        
       
        if(varientTaxDetails.length == 0){
            let productTb = await db.collection('product');
            let productResponse = await productTb.findOne({"id":modelvarientDetails[0].productId},{projection:{ProductName:1}})
            modelvarientDetails[0].ProductName=productResponse.ProductName
            
            return res.json({
                status:true,
                data:modelvarientDetails
            })

        }
        else{
            return res.json({
                status:true,
                data:varientTaxDetails
            })

        }
        


    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error

        })
    }
}
//get multiple varients with id

async function getMultipleVarientsByIds(req, res) {
    let ModelVariantName = req.query.ModelVariantName;

    ModelVariantName = ModelVariantName.split(',');
    // ModelVariantName=ModelVariantName.reverse();
    let varientData = []
    try {
        for (var i = 0; i < ModelVariantName.length; i++) {
            let varientid = ModelVariantName[i]
            let db = await mongo.connect();//database connection 
            let modelVarientTb = await db.collection('modelVarient');//connect model varient table
            let modelvarientDetails = await modelVarientTb.aggregate([
                {
                    $lookup: {
                        from: "productBrands",//child table name
                        localField: "product_brand",//parent table field
                        foreignField: "id",//chils field name
                        as: "productList"
                    }
                },
                {
                    $match: { "id": { $eq: varientid } }
                }]).toArray()

            varientData.push(modelvarientDetails[0])


        }
        return res.json({
            status: true,
            data: varientData
        })
    } catch (error) {
        console.log("error---", error);
        return res.json({
            status: true,
            message: error
        })
    }


}


//get related varients Based on productId

async function getRelatedVarients(req, res) {
    let productId = req.query.productId
    try {
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');//connect model varient table
        let getRelatedvarientDetails = await modelVarientTb.aggregate([
            {
                $lookup: {
                    from: "productBrands",//child table name
                    localField: "product_brand",//parent table field
                    foreignField: "id",//chils field name
                    as: "productList"
                }
            },


            {
                $match: { "productId": { $eq: productId }, }
            }

        ]).toArray();

        let modelvarientsids=[]

        getRelatedvarientDetails.forEach((element) => {
            modelvarientsids.push(element.id)
            
        })

      let locationtaxprices = await taxLocation.taxLocation(req.query);
      let varientTaxDetails = await taxLocation.relatedvarientsTaxcalculation(locationtaxprices,modelvarientsids);
        return res.json({
            status: true,
            data: varientTaxDetails
        })

    }
    catch (error) {
        console.log("error----", error);
        return res.json({
            status: false,
            message: error
        })
    }
}

//get Varients Based on fuelType

async function getVarientsBasedOnFuel(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');//connect model varient table
        let varientDetails = await modelVarientTb.aggregate([
            {
                $lookup: {
                    from: "productBrands",//child table name
                    localField: "product_brand",//parent table field
                    foreignField: "id",//chils field name
                    as: "productList"
                }
            },


            {
                $match: { "$and": [{ "Fuel": { $eq: req.query.Fuel } }, { "productId": { $eq: req.query.productId } }] }
            }

        ]).toArray();
        return res.json({
            status: true,
            data: varientDetails


        })

    }
    catch (error) {
        console.log(error, "------error");
        return res.json({
            status: false,
            message: error

        })
    }
}


async function updateSpecificationsVarientsById(req, res) {
    try {
        let id = req.query.id
        let data = req.body.KeySpecifications;
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');//connect model varient table
        const keys = Object.keys(data);
        let results = [];

        for (var i = 0; i < keys.length; i++) {
            var obj = {};
            const key = keys[i];
            obj.title = key;

            let val = data[key];
            const valkeys = Object.keys(val);
            var context = [];
            for (var j = 0; j < valkeys.length; j++) {
                var subobj = {};
                subobj.key = valkeys[j];
                subobj.value = val[valkeys[j]];

                context.push(subobj);
            }
            obj.context = context;
            results.push(obj);

        }

        await modelVarientTb.findOneAndUpdate({ "id": id }, { $set: { "KeySpecifications": results } });
        return res.json({
            status: true,
            message: "Updated  specifications successfully"
        })

    }
    catch (error) {
        console.log("error----", error);
        return res.json({
            status: false,
            message: error

        })
    }
}

//get varients  specification which has highest price 

async function getVarientSpecificationHighestPrice(req, res) {
    try {
        let ModelVariantName = req.query.ModelVariantName;
        ModelVariantName = ModelVariantName.split(',');
        let db = await mongo.connect();//database connection 
        let modelVarientTb = await db.collection('modelVarient');//connect model varient table
        let query = {}

        query.id = {
            "$in": ModelVariantName
        };
        console.log("query----", query);
        let getvarientDetails = await modelVarientTb.find(query).sort({ "Price": -1 }).limit(1).toArray();

        return res.json({
            status: true,
            data: getvarientDetails
        })
    }
    catch (error) {
        console.log("error----", error);
        return res.json({
            status: false,
            message: error
        })
    }

}


//varients brochure   form Download API

async function downloadBrochureFormApi(req,res){
    try{
        let form = req.body;
        let db = await mongo.connect();//database connection 
        let downloadBrochuresTb = await db.collection('downloadBrochures');//connect model varient table
        await downloadBrochuresTb.insertOne(form);
        return res.json({
            status:true,
            message:"Brochure added successfully"
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

module.exports.createModelVarient = createModelVarient
module.exports.createBrands = createBrands
module.exports.createFuelType = createFuelType
module.exports.getModelVarient = getModelVarient
module.exports.createFeatures = createFeatures
module.exports.ListOfBrandnames = ListOfBrandnames
module.exports.getListOfModelVarients = getListOfModelVarients
module.exports.getModelVarientsById = getModelVarientsById
module.exports.getMultipleVarientsByIds = getMultipleVarientsByIds
module.exports.getRelatedVarients = getRelatedVarients
module.exports.getVarientsBasedOnFuel = getVarientsBasedOnFuel
module.exports.updateSpecificationsVarientsById = updateSpecificationsVarientsById
module.exports.getVarientSpecificationHighestPrice = getVarientSpecificationHighestPrice
module.exports.downloadBrochureFormApi = downloadBrochureFormApi