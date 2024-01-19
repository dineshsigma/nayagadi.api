
let express = require('express');

let app = express();
var mongo = require("../db.js");
const { v4: uuidv4 } = require('uuid');
var cors = require('cors');
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var PhoneNumber = require('awesome-phonenumber');
const res = require('express/lib/response');
var mongo = require("../db.js");



async function taxLocation(query) {
    try {
        let db = await mongo.connect();//database connection 
        let LocationTaxTb = await db.collection('LocationTax');//connect LOCATION TAX table
        let modelvarientTb = await db.collection('modelVarient');//connect LOCATION TAX table
        let cityTb = await db.collection('LocationTax');
        let locationtaxprices;
        if (query.cityid == undefined) {
            locationtaxprices = await LocationTaxTb.find({ "state": 'Telangana', "city": 'Hyderabad' }).toArray();
            
            return locationtaxprices
        }
        else {
            let getstate = await cityTb.find({ "city":query.cityid }).toArray();
            locationtaxprices = await LocationTaxTb.find({ "state": getstate[0].state, "city": query.cityid }).toArray();
            
            return locationtaxprices
        }

    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }

}



async function taxCalculation(locationtaxprices,ModelVariantName,modelvarientDetails){
    let db = await mongo.connect();//database connection 
        let modelvarientTb = await db.collection('modelVarient');//connect LOCATION TAX table
        let productTb = await db.collection('product');
        let productResponse = await productTb.findOne({"id":modelvarientDetails[0].productId},{projection:{ProductName:1}})
        modelvarientDetails[0].ProductName=productResponse.ProductName
        
       
        let varientsEnginee;
        let varientPrices;
  
       
        for (var i = 0; i < locationtaxprices.length; i++) {//---for loop for  type of taxes(enginee,price slab,CAP)
            //if type_of_tax is Enginee
            if (locationtaxprices[i].type_of_tax == "Engine") {
                let query = {}
                query.Engine = { "$lte": parseInt(locationtaxprices[i].engine) };
                query.id={"$in":[ModelVariantName]}
                varientsEnginee = await modelvarientTb.find(query).toArray();
                //Enginee has two type of ammounts --(Percentage,Fixed Amount)
                if (locationtaxprices[i].typeofamount == 'Percentage') {
                    varientsEnginee.forEach((element) => {
                        element.productBrand=modelvarientDetails[0].productList
                        element.ProductName=productResponse.ProductName
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = element.Price * locationtaxprices[i].type_percent
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });
                }
                if (locationtaxprices[i].typeofamount == 'Fixed Amount') {
                    varientsEnginee.forEach((element) => {
                        element.productBrand=modelvarientDetails[0].productList
                        element.ProductName=productResponse.ProductName
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = parseInt(locationtaxprices[i].type_fixedamount)
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });

                }
                finaldata = [ ...varientsEnginee]
            }
            //if type_of_tax is Price slab
            if (locationtaxprices[i].type_of_tax == 'Price slab') {
                let query = {}
                query.Price = {
                    "$gte": locationtaxprices[i].pricerange[0],
                    "$lte": locationtaxprices[i].pricerange[1]
                }
                query.id={"$in":[ModelVariantName]}
                varientPrices = await modelvarientTb.find(query).toArray();
               
                if (locationtaxprices[i].typeofamount == 'Percentage') {
                    varientPrices.forEach((element) => {
                        element.productBrand=modelvarientDetails[0].productList
                        element.ProductName=productResponse.ProductName
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = element.Price * locationtaxprices[i].type_percent || 0
                        element.insurance = parseInt(locationtaxprices[i].insurance) || 0
                        element.fasttag = parseInt(locationtaxprices[i].fastag) || 0
                        element.tcs = element.Price * locationtaxprices[i].tcs || 0
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs 
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty) || 0
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges) || 0
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit) || 0
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });
                }
                if (locationtaxprices[i].typeofamount == 'Fixed Amount') {
                    varientPrices.forEach((element) => {
                        element.productBrand=modelvarientDetails[0].productList
                        element.ProductName=productResponse.ProductName
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = parseInt(locationtaxprices[i].type_fixedamount)
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                        

                    });

                }
                finaldata = [ ...varientPrices]
               
            }
            
         }

        return finaldata;

 
}

async function relatedvarientsTaxcalculation(locationtaxprices,ModelVariantName){
    let db = await mongo.connect();//database connection 
    let modelvarientTb = await db.collection('modelVarient');//connect LOCATION TAX table
        let varientsEnginee;
        let varientPrices;
        for (var i = 0; i < locationtaxprices.length; i++) {//---for loop for  type of taxes(enginee,price slab,CAP)
            //if type_of_tax is Enginee
            if (locationtaxprices[i].type_of_tax == "Engine") {
                let query = {}
                query.Engine = { "$lte": parseInt(locationtaxprices[i].engine) };
                query.id={"$in":ModelVariantName}
                varientsEnginee = await modelvarientTb.find(query).toArray();
                //Enginee has two type of ammounts --(Percentage,Fixed Amount)
                if (locationtaxprices[i].typeofamount == 'Percentage') {
                    varientsEnginee.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = element.Price * locationtaxprices[i].type_percent
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });
                }
                if (locationtaxprices[i].typeofamount == 'Fixed Amount') {
                    varientsEnginee.forEach((element) => {
                       
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = parseInt(locationtaxprices[i].type_fixedamount)
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });

                }
                finaldata = [ ...varientsEnginee]
            }
            //if type_of_tax is Price slab
            if (locationtaxprices[i].type_of_tax == 'Price slab') {
                let query = {}
                query.Price = {
                    "$gte": locationtaxprices[i].pricerange[0],
                    "$lte": locationtaxprices[i].pricerange[1]
                }
                query.id={"$in":ModelVariantName}
                varientPrices = await modelvarientTb.find(query).toArray();
                // console.log("varientPrices-------",varientPrices);
                if (locationtaxprices[i].typeofamount == 'Percentage') {
                    varientPrices.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = element.Price * locationtaxprices[i].type_percent || 0
                        element.insurance = parseInt(locationtaxprices[i].insurance) || 0
                        element.fasttag = parseInt(locationtaxprices[i].fastag) || 0
                        element.tcs = element.Price * locationtaxprices[i].tcs || 0
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs 
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty) || 0
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges) || 0
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit) || 0
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });
                }
                if (locationtaxprices[i].typeofamount == 'Fixed Amount') {
                    varientPrices.forEach((element) => {
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.locationpriceTax = locationpriceTax = locationtaxprices[i];
                        element.tax = parseInt(locationtaxprices[i].type_fixedamount)
                        element.insurance = parseInt(locationtaxprices[i].insurance)
                        element.fasttag = parseInt(locationtaxprices[i].fastag)
                        element.tcs = element.Price * locationtaxprices[i].tcs
                        element.onRoadPrice = element.Price + element.tax + element.insurance + element.fasttag + element.tcs
                        element.extended_warranty = parseInt(locationtaxprices[i].extended_warranty)
                        element.accessories_charges = parseInt(locationtaxprices[i].accessories_charges)
                        element.essentisal_kit = parseInt(locationtaxprices[i].essentisal_kit)
                        element.Total = element.onRoadPrice + element.extended_warranty + element.accessories_charges + element.essentisal_kit
                        element.tax=element.tax.toFixed(2)
                        element.tcs=element.tcs.toFixed(2)
                    });

                }
                finaldata = [ ...varientPrices]
            }
            
         }
        return finaldata;

}

module.exports.taxLocation = taxLocation
module.exports.taxCalculation = taxCalculation
module.exports.relatedvarientsTaxcalculation = relatedvarientsTaxcalculation




