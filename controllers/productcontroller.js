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
var taxLocation = require('../modules/taxcalculation')
// app.use(cors({origin: true, credentials: true}));



async function UpdateProductSpecifications(req, res) {
    try {
        let payload = req.body;
        let db = await mongo.connect();//database connection 
        let productTb = db.collection('product');//connect product collection
        const keys = Object.keys(data);
        let specificationresults = [];
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
            }//innser for loop
            obj.context = context;
            specificationresults.push(obj);//push entire object to specification results array

        }//outer for loop
        // console.log("Specification Result", specificationresults);
        //update specifications for products  based on ids
        await productTb.findOneAndUpdate({ "id": req.query.id }, { $set: {} });
        return res.json({
            status: true,
            message: "specifications updated successfully"
        })




    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }

}



//add products Specifications


async function CreateProducts(req, res) {
    try {
        let payload = req.body;
        payload.id = uuidv4();
        let specificationjson = req.body.keyspecifications

        let db = await mongo.connect();//database connection 
        let productTb = db.collection('product');//connect product collection
        const keys = Object.keys(specificationjson);
        let specificationresults = [];
        for (var i = 0; i < keys.length; i++) {
            var obj = {};
            const key = keys[i];
            obj.title = key;
            let val = specificationjson[key];
            const valkeys = Object.keys(val);
            var context = [];
            for (var j = 0; j < valkeys.length; j++) {
                var subobj = {};
                subobj.key = valkeys[j];
                subobj.value = val[valkeys[j]];

                context.push(subobj);
            }//innser for loop
            obj.context = context;
            specificationresults.push(obj);//push entire object to specification results array

        }//outer for loop

        payload.specificationjson = specificationjson
        await productTb.insertOne(payload);
        return res.json({
            status: true,
            message: "product addedd successfully"

        })



    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }
}


//get list of all product details

async function ProductList(req, res) {
    let name = req.query.name
    let page = req.query.page
    if (name != undefined && name != null && name != '') {
        name = name
    }
    else {
        name = ""
    }
    try {
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let getAllproducts = await productTb.aggregate([
            {
                $lookup: {
                    from: "modelVarient",//child table name
                    localField: "variants",//parent table field
                    foreignField: "id",//chils field name
                    as: "ModelVariantNameList",

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
                $lookup: {
                    from: "features",//child table name
                    localField: "Features",//parent table field
                    foreignField: "id",//chils field name
                    as: "features",

                }
            },
            {
                $match: {
                    $or: [
                        { "ProductName": { $regex: name, $options: "si" } },
                        { "searchkey": { $regex: name, $options: "si" } }
                    ]
                }
            },
            { $skip: 6 * (page - 1) },
            { $limit: 6 },
            { $sort: { "weight": 1 } }
        ]).toArray();

        let noOfProducts = await productTb.aggregate([
            {
                $match: {
                    $or: [
                        { "ProductName": { $regex: name, $options: "si" } },
                        { "searchkey": { $regex: name, $options: "si" } }
                    ]
                }
            }

        ]).toArray();

        return res.json({
            status: true,
            TotalProducts: noOfProducts.length,
            data: getAllproducts
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

//get product by id

async function getProductByID(req, res) {
    let productId = req.query.productId
    try {
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let getproductResponse = await productTb.aggregate([

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
                $lookup: {
                    from: "features",//child table name
                    localField: "Features",//parent table field
                    foreignField: "id",//chils field name
                    as: "features",

                }
            },
            {
                $match: { id: `${productId}` }
            }

        ]).toArray()
        let response = getproductResponse[0]
        //  console.log("getproductResponse----", response.variants)

        if (response.variants.length > 0) {
            let variants = response.variants

            let modelVarientTb = await db.collection('modelVarient');//connect model varient table
            let query = {}

            query.id = {
                "$in": variants
            };
            // console.log("query----", query);
            let getvarientDetails = await modelVarientTb.find(query, { projection: { "KeySpecifications": 1, "brochure": 1 } }).sort({ "Price": -1 }).limit(1).toArray();

            getproductResponse[0].Modelspec = getvarientDetails[0].KeySpecifications
            getproductResponse[0].brochure = getvarientDetails[0].brochure
            let locationtaxprices = await taxLocation.taxLocation(req.query.cityid);
            let varientTaxDetails = await taxLocation.relatedvarientsTaxcalculation(locationtaxprices, variants);
            let ModelVariantNameList = []

            if (varientTaxDetails.length != 0) {

                varientTaxDetails.forEach((element) => {
                    ModelVariantNameList.push(element)
                })
                getproductResponse[0].ModelVariantNameList = ModelVariantNameList
            }

        }
        else {
            getproductResponse[0].Modelspec = []

        }



        return res.json({
            status: true,
            data: getproductResponse
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

//search price range to get product details

async function SearchPriceFilter(req, res) {
    try {
        let page = req.query.page;
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let searchPriceWithCarType;
        let noOfProducts


        if (req.query.priceRange != undefined && req.query.priceRange != null && req.query.priceRange != "" && req.query.priceRange != "undefined" && req.query.car_type == 'undefined') {

            searchPriceWithCarType = await productTb.aggregate([

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
                    $lookup: {
                        from: "features",//child table name
                        localField: "Features",//parent table field
                        foreignField: "id",//chils field name
                        as: "features",

                    }
                },

                {
                    $match: {
                        "priceRange": { $eq: req.query.priceRange }

                    }
                },
                { $skip: 5 * (page - 1) },
                { $limit: 5 },
                { $sort: { "weight": 1 } }

            ]).toArray()
            noOfProducts = await productTb.find({priceRange:req.query.priceRange}).toArray();

        }
        else if (req.query.car_type != undefined && req.query.car_type != null && req.query.car_type != "" && req.query.car_type != "undefined" && req.query.priceRange == 'undefined') {

            searchPriceWithCarType = await productTb.aggregate([

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
                    $match: {
                        "car_type": { $eq: req.query.car_type },

                    }
                },
                { $skip: 5 * (page - 1) },
                { $limit: 5 },
                { $sort: { "weight": 1 } }

            ]).toArray()
            noOfProducts = await productTb.find({car_type:req.query.car_type}).toArray();

        }


        else {


            searchPriceWithCarType = await productTb.aggregate([

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
                    $match: {
                        "$and": [
                            { "car_type": { $eq: req.query.car_type } },
                            { "priceRange": { $eq: req.query.priceRange } }
                        ]

                    }
                },
                { $skip: 5 * (page - 1) },
                { $limit: 5 },
                { $sort: { "weight": 1 } }

            ]).toArray()
            noOfProducts = await productTb.find({car_type:req.query.car_type,priceRange:req.query.priceRange}).toArray();
        }

       



        return res.json({
            status: true,
            TotalProducts: noOfProducts.length,
            data: searchPriceWithCarType

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

//get list of product names
async function getListOfProductNames(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect model varient table
        let listofProductNames;
        let page = req.query.page;
        let noofProducts;

        if (req.query.products_brand != null && req.query.products_brand != "" && req.query.products_brand != "undefined" && req.query.productName == 'undefined') {
            
            
            listofProductNames = await productTb.aggregate([

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
                    $lookup: {
                        from: "features",//child table name
                        localField: "Features",//parent table field
                        foreignField: "id",//chils field name
                        as: "features",

                    }
                },

                {
                    $match: { "products_brand": { $eq: req.query.products_brand } }
                },
                { $skip: 5 * (page - 1) },
                { $limit: 5 },
                { $sort: { "weight": 1 } }

            ]).toArray()
             noofProducts=await productTb.find({ "products_brand": req.query.products_brand}).toArray()
        }
        else {


            listofProductNames = await productTb.aggregate([

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
                    $match: { "id": { $eq: req.query.productName } }
                },
                { $skip: 5 * (page - 1) },
                { $limit: 5 },
                { $sort: { "weight": 1 } }

            ]).toArray()
            noofProducts=await productTb.find({ "id": req.query.productName}).toArray()
            
        }


        // let noOfProducts = await productTb.find({}).toArray();

        return res.json({
            status: true,
            TotalProducts: noofProducts.length,
            data: listofProductNames
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

//get brand with productNames

async function SearchBrandWithProductName(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let productDetails = await productTb.aggregate([
            {
                $lookup: {
                    from: "modelVarient",//child table name
                    localField: "variants",//parent table field
                    foreignField: "id",//chils field name
                    as: "ModelVariantNameList"
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
                $lookup: {
                    from: "features",//child table name
                    localField: "Features",//parent table field
                    foreignField: "id",//chils field name
                    as: "features",

                }
            },
            {
                $match: { "id": { $eq: req.query.ProductName }, }
            }

        ]).toArray();
        return res.json({
            status: true,
            data: productDetails

        })



    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error

        })
    }
}




async function getTagNameWithProducts(req, res) {
    let TagName = req.query.TagName
    try {
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let getproductResponse = await productTb.aggregate([

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
                    from: "fuelType",//child table name
                    localField: "fuel_types",//parent table field
                    foreignField: "id",//chils field name
                    as: "fuelType",

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
                    from: "features",//child table name
                    localField: "Features",//parent table field
                    foreignField: "id",//chils field name
                    as: "features",

                }
            },
            {
                $match: { TagName: `${TagName}` }
            }

        ]).toArray()
        // console.log("getproductResponse----", getproductResponse)

        return res.json({
            status: true,
            data: getproductResponse
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

async function listOfCarTypes(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let cartypeTb = await db.collection('cartype');//connect product collection
        let listofcarvarients = await cartypeTb.find({}).toArray();
        let carTypesArray = []
        // for(var i=0;i<listofcarvarients.length;i++){
        //     carTypesArray.push(listofcarvarients[i].cartype)

        // }
        return res.json({
            status: true,
            data: listofcarvarients
        })

    }
    catch (error) {
        console.log("error--", error);
        return res.json({
            status: false,
            message: error
        })

    }
}



async function PriceRanges(req, res) {
    try {
        let payload = req.body;
        payload.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let priceRangeTb = await db.collection('priceRange');//connect product collection
        await priceRangeTb.insertOne(payload);
        return res.json({
            status: true,
            message: "inserted success"
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

async function listOfAllPriceRanges(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let priceRangeTb = await db.collection('priceRange');//connect product collection
        let pricerangeResonse = await priceRangeTb.find({}).toArray();
        pricerangeResonse = pricerangeResonse.sort((a, b) => {
            if (a.weight < b.weight) {
                return -1;
            }
        });


        return res.json({
            status: true,
            data: pricerangeResonse
        })

    }
    catch (error) {
        console.log("error---", error);
        return res.json({

        })
    }
}

//get productDetails Based on brand names


async function getProductsBasedOnBrands(req, res) {
    try {
        let products_brand = req.query.products_brand
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let productDetailsList = await productTb.find({ "products_brand": req.query.products_brand }, { projection: { "id": 1, "ProductName": 1 } }).toArray();
        return res.json({
            status: true,
            data: productDetailsList
        })

    }
    catch (error) {
        console.log("error--", error);
        return res.json({
            status: false,
            message: error
        })

    }

}


//get modelvarients based on productName


async function getVarientsBasedOnProductName(req, res) {
    try {
        let productName = req.query.productName

        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let productDetailsList = await productTb.aggregate([
            {
                $lookup: {
                    from: "modelVarient",//child table name
                    localField: "variants",//parent table field
                    foreignField: "id",//chils field name
                    as: "ModelVariantNameList"
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
                $lookup: {
                    from: "features",//child table name
                    localField: "Features",//parent table field
                    foreignField: "id",//chils field name
                    as: "features",

                }
            },
            {
                $match: { "id": { $eq: productName }, }
            }

        ]).toArray();
        return res.json({
            status: true,
            data: productDetailsList

        })

    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }
}

//cars with similar price

async function getProductsWithSimilarPrice(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let productDetailsList = await productTb.aggregate([
            {
                $lookup: {
                    from: "modelVarient",//child table name
                    localField: "variants",//parent table field
                    foreignField: "id",//chils field name
                    as: "ModelVariantNameList"
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
                $lookup: {
                    from: "features",//child table name
                    localField: "Features",//parent table field
                    foreignField: "id",//chils field name
                    as: "features",

                }
            },
            {
                $match: { "$and": [{ "initialPrice": { $gt: parseInt(req.query.initialPrice) } }, { "finalPrice": { $lt: parseInt(req.query.finalPrice) } }] }
            }

        ]).toArray();
        return res.json({
            status: true,
            data: productDetailsList

        })

    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }

}


//compare right vehicles

async function CompareModels(req, res) {
    try {
        let db = await mongo.connect();//database connection 
        let compareModelsTb = await db.collection('compareModels');//connect product collection
        let getCompareProductResponse = await compareModelsTb.aggregate([
            {
                $lookup: {
                    from: "product",//child table name
                    localField: "compareModels",//parent table field
                    foreignField: "ProductName",//chils field name
                    as: "Modellist"
                }
            },
            { $sort: { weight: -1 } }
        ]).toArray()

        try {

            for (var i = 0; i < getCompareProductResponse.length; i++) {
                for (var j = 0; j < getCompareProductResponse[i].Modellist.length; j++) {
                    // for(var k=0;k<getCompareProductResponse[i].Modellist[j].variants.length;k++){
                    // console.log("nsavchjsdbvcghds",getCompareProductResponse[i].Modellist[j].products_brand)
                    let productBrandsTb = await db.collection('productBrands');//connect product collection
                    let varientsTb = await db.collection('modelVarient');
                    let productBrandresponse = await productBrandsTb.findOne({ "id": getCompareProductResponse[i].Modellist[j].products_brand });
                    // let varientsresponse = await varientsTb.aggregate([{$match:{"id":{$in:getCompareProductResponse[i].Modellist[j].variants}}}])
                    //  console.log("varientsresponse---",varientsresponse)
                    getCompareProductResponse[i].Modellist[j].BrandName = productBrandresponse.BrandName

                    // }


                }

            }
        } catch (error) {
            console.log("error---", error);
            return res.json({ status: false, message: error })
        }

        return res.json({
            status: true,
            data: getCompareProductResponse
        })

    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }
}



async function createcartypes(req, res) {
    try {
        let form = req.body;
        form.id = uuidv4();
        let db = await mongo.connect();//database connection 
        let cartypeTb = await db.collection('cartype');//connect product collection
        await cartypeTb.insertOne(form);
        return res.json({
            status: true,
            message: "created success"
        })


    } catch (error) {
        console.log("error0---", error);
        return res.json({
            status: false,
            message: error
        })
    }
}

async function noOfProductsBasedOnCategory(req,res){
    try{
        let db = await mongo.connect();//database connection 
        let productTb = await db.collection('product');//connect product collection
        let noofproductsRes = await productTb.find({"category":"Cars"}).toArray();
        return res.json({
            status:true,
            data:noofproductsRes.length
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



module.exports.UpdateProductSpecifications = UpdateProductSpecifications;
module.exports.CreateProducts = CreateProducts;
module.exports.ProductList = ProductList;
module.exports.getProductByID = getProductByID;
module.exports.SearchPriceFilter = SearchPriceFilter;
module.exports.SearchBrandWithProductName = SearchBrandWithProductName;
module.exports.getListOfProductNames = getListOfProductNames;
module.exports.getTagNameWithProducts = getTagNameWithProducts;
module.exports.listOfCarTypes = listOfCarTypes;
module.exports.PriceRanges = PriceRanges;
module.exports.listOfAllPriceRanges = listOfAllPriceRanges;
module.exports.getProductsBasedOnBrands = getProductsBasedOnBrands;
module.exports.getVarientsBasedOnProductName = getVarientsBasedOnProductName;
module.exports.getProductsWithSimilarPrice = getProductsWithSimilarPrice;
module.exports.CompareModels = CompareModels
module.exports.createcartypes = createcartypes
module.exports.noOfProductsBasedOnCategory = noOfProductsBasedOnCategory